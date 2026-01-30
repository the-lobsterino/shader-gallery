#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float time;

#define lerp(x,y,t) (y - x ) * t + x

#define ANTIALIASING 4.0

float hash(float index) {
	float n = 100000000.0 / (mod(index, 243959.0) + 1.0);
	
	n = float(int(n)) / (fract(n) + 1.0);
	
	n *= 58302.0;
	n = mod(n, 2995.0);
	n *= 0.5;
	n /= mod(n * 0.042 + 1.0, 10.0);
	n *= 65536.0;
	n = mod(n, 255.0);
	n /= 4.0;
	n *= fract(n) + 0.01;
	n *= 100.0;
	n = mod(n, 255.0);
	
	return n / 255.0;
}

float noise(float index) {
	return hash(hash(index) * 93752.0);
}

float plane( vec3 p, vec3 n, float h ) {
  return dot(p,n) + h;
}

float checkers(vec2 p)
{
    vec2 w = fwidth(p) + 0.001;
    vec2 i = 2.0*(abs(fract((p-0.5*w)*0.5)-0.5)-abs(fract((p+0.5*w)*0.5)-0.5))/w;
    return 0.5 - 0.5*i.x*i.y;
}

float sphere( vec3 p, float s ) {
  return length(p)-s;
}

#define map(p) min(plane(p,vec3(0, 2.5, 0),.5),sphere(p-vec3(0,.05,-.1),.125))

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    float res = 1.0;
    float t = mint;
    float ph = 1e10; // big, such that y = 0 on the first iteration
    
    for( int i=0; i<64; i++ )
    {
        float h = map( ro + rd*t );


            float y = h*h/(2.0*ph);
            float d = sqrt(h*h-y*y);
            res = min( res, 10.0*d/max(0.0,t-y) );
            ph = h;
        
        
        t += h;
        
        if( res<0.0001 || t>tmax ) break;
        
    }
    res = clamp( res, 0.0, 1.0 );
    return res*res*(3.0-2.0*res);
}

vec3 calcNormal(vec3 pos) {
	const vec2 e = vec2(.001, 0);
	return normalize(vec3(map(pos + e.xyy) - map(pos - e.xyy), map(pos + e.yxy) - map(pos - e.yxy),	
                          map(pos + e.yyx) - map(pos - e.yyx)));
}

vec3 p;
float trace(vec3 r, vec3 o) {
	float t, d;
	for (int i = 0; i < 64; i++) {
		p = o+(r*t);
		d = map(p);
		t += d;
		
		if(t > 20.0)
			break;
	}
	return t;
}

vec3 render(float sample, vec2 shift) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy + shift) / min(resolution.x, resolution.y);
    
    vec2 noisev2 = vec2(
    	noise(uv.x + 4.0 + (uv.y + 4.0) * resolution.x + fract(time) * 525.0 - sample),
	noise(uv.x + 4.0 + (uv.y + 4.0) * resolution.x + fract(time) * 625.0 + 1.0 - sample)
    ) * 0.05 - 0.025;
	float focus = cos(time) * 0.25 + 0.58;
    	vec3 r = normalize(vec3(uv + noisev2 / focus, 1.0));
    vec3 o = vec3(-noisev2,-.5); // camera position
    vec3 qq;
    vec3 n;
    vec3 nn;
    float t,brightness,sha;
    
    t = trace(r,o);
    o += r*t;
    n = calcNormal(o);
    vec3 pp = r;
    vec3 q = p;
    brightness = 1.0 / (1.0 + t * t * 0.1);
    r = reflect(r,n);
    t = trace(r,o+n*.003);
    o += r*t;

	

    sha = clamp(calcSoftshadow( p-vec3(0,0,0), normalize( vec3(0., 1., 0.)  ), .25,5. ),.5,1.);
    vec3 l = vec3(-1.2, -160., 0.4);
    vec3 dl = normalize(n - l);
    vec3 ch = vec3(
	          lerp(0.,1.,checkers((pp.z>r.z?p.xz:q.xz)*8.)),0,
	          lerp(1.,0.,checkers((pp.z>r.z?p.xz:q.xz)*8.)));
    ch = pp.z>r.z&&uv.y>0.2?vec3(1): pp.z>r.z?ch*2.:ch; 
    float col = brightness*lerp(0.,dot(n,dl),dot(n,dl));
    return ch*col*sha;
}

void main() {
    	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0);
	float coef = noise(uv.x + 4.0 + (uv.y + 4.0) * resolution.x + fract(time) * 152.0 + 2.0);
	
	for(float x = 0.0; x < ANTIALIASING; x++) {
		for(float y = 0.0; y < ANTIALIASING; y++) {
			color += clamp(render(x + y * ANTIALIASING, vec2(x, y) * 2.0 / ANTIALIASING - 1.0), 0.0, 1.0);
		}
	}
	
	color /= ANTIALIASING * ANTIALIASING;
	color *= pow(coef * 0.1 + 0.95, 2.0);
	color += pow(coef * 2.0, 3.0) * 0.014;
	
	gl_FragColor = vec4(color, 1.0);
}