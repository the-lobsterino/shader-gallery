#ifdef GL_ES
precision mediump float;
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//#define denoise
#define aspect (resolution.x/resolution.y)

vec4 	pid(float p, float t, float e, float i, float d);
float	line(vec2 p, vec2 a, vec2 b, float w);
float	hash(float v);
float	noise(in vec2 v);
vec2	toworld(vec2 p);
vec4	read(vec2 uv);

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	vec2 p	= toworld(uv);
	
	vec4 m0	= read(vec2(.01, .01));	    //x pid
	vec4 m1	= read(vec2(1.5/32., .01)); //y pid	
	vec4 m2 = read(vec2(2.5/32., .01)); //current position and heading
	vec4 m3 = read(vec2(3.5/32., .01)); //target reading
	
	//signal noise
	float s =  p.y + time * 128.5 + 2. - cos(time); 
	vec2 n	= vec2(0., noise(vec2(s)));
	
    #ifdef denoise
    n *= .0;
    #else
    n *= .03;
    #endif
    

	//pid control
	vec4 dx	= pid(m2.x, m3.x, m0.y, m0.z, m2.z); 
	vec4 dy	= pid(m2.y, m3.y, m1.y, m1.z, m2.w); 
	vec2 d  = mix(m2.zw*2.-.5, vec2(dx.x, dy.x), .5);
	
	//adjust position to target
	vec2 t	= n + m2.xy + d * .1 - .003; //fudge .003 helps with the buffer not going negative
	vec2 nt = mix(m3.xy, vec2(.95, 0.)+n*32., .5);

    //current position and objective
	float c = step(length(toworld(t)-p), .02)*.5;
	float o = step(length(toworld(m3.xy)-p), .02)*.5;	
	float l = line(p, toworld(m2.xy), toworld(m3.xy), .01);
	
    //graph
	vec4 g = vec4(0.);
	float fy = fract(uv.y/aspect*32.);
	g.x = abs(m3.x-m2.x);
	g.x = float(g.x > fy - .05 && g.x < fy + .05)*.5;	
	g.y = abs(m3.y-m2.y);
	g.y = float(g.y > fy - .05 && g.y < fy + .05)*.5;
	g = uv.x < .999 ? read(vec2(uv.x+1./resolution.x, uv.y)) : g;		

    //result 
	vec4 r = vec4(o, c, l, 1.);
    
    //glowy trail!
	r.rg += texture2D(renderbuffer, uv+vec2(1./resolution.y, 0.)).rg * .999;
	
    //buffer writes
	float a = floor(1.+uv.x*32.)*float(floor(uv.y/aspect*32.)<1.);
	r = a == 1. ? dx : r;
	r = a == 2. ? dy : r;
	r = a == 3. ? vec4(t, d*.5-.5) : r;
	r = a == 4. ? vec4(nt,0.,0.) : r;
	
	r = a == 5. ? vec4(dx.x, 0., 0., 0.) : r;
	r = a == 6. ? vec4(0., dx.y, 0., 0.) : r;
	r = a == 7. ? vec4(0., 0., dx.z, 0.) : r;
	r = a == 8. ? vec4(0., 0., 0., dx.w) : r;
	
	r = a == 9. ? vec4(dy.x, 0., 0., 0.) : r;
	r = a == 10. ? vec4(0., dy.y, 0., 0.) : r;
	r = a == 11. ? vec4(0., 0., dy.z, 0.) : r;
	r = a == 12. ? vec4(0., 0., 0., dy.w) : r;
	
	r = a >= 13. ? g : r;
	
	gl_FragColor = r;
}//sphinx

#define kp .9391
#define ki .5
#define kd .0098

vec4 pid(float p, float t, float e, float i, float d){
	float error 	= t - p;
	float integral	= i + error/2.;
	float delta	= error - e;
	
	float position 	= kp*error + ki*integral + kd*delta;
	return vec4(position, error, integral, delta);
}

float line(vec2 p, vec2 a, vec2 b, float w){
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}

float hash(float v)
{
    return fract(sin(v)*43758.5453123);
}

float noise(in vec2 v)
{
    vec2 p = floor(v);
    vec2 f = fract(v);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    p.x = mix(hash(n+ 0.), hash(n+  1.), f.x);
    p.y = mix(hash(n+57.), hash(n+ 58.), f.x);
    float res = mix(p.x, p.y, f.y);
    return res;
}

vec2 toworld(vec2 p){
	p = p * 2. - 1.;
	p.x *= aspect;
	return p;
}

vec4 read(vec2 uv){
	return texture2D(renderbuffer, uv);	
}
