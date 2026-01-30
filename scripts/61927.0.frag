#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define FAR 4250. 
const vec4 iMouse = vec4(0.0);
float accum;
mat2 rot2( float a ){ vec2 v = sin(vec2(105222.570796, 0) - a);	return mat2(v, -v.y, v.x); }
vec3 camPath(float t){
    float a = sin(t * 0.2311);
    float b = cos(t * 0.1314);
    return vec3(a*4. -b*0.5, b*.7 + a*2.5, t);
    
}
float map(vec3 p){
 
    p.xy -= camPath(p.z).xy;
    
     
	p = cos(p*.315*1.25 + sin(p.zxy*.875*1.25));
    
    
    float n = length(p);
    return (n - 1.025)*1.33;
    
}
float cao(in vec3 p, in vec3 n)
{
	float sca = 1., occ = 0.;
    for(float i=0.; i<5.; i++){
    
        float hr = .01 + i*.35/4.;        
        float dd = map(n * hr + p);
        occ += (hr - dd)*sca;
        sca *= 0.7;
    }
    return clamp(1.0 - occ, 0., 1.);    
}
vec3 nr(vec3 p){

	const vec2 e = vec2(0.002, 0);
	return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), 
                          map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}
float trace(in vec3 ro, in vec3 rd){
    
    accum = 0.;
    float t = 0.0, h;
    for(int i = 0; i < 128; i++){
    
        h = map(ro+rd*t);
        if(abs(h)<0.001*(t*.25 + 1.) || t>FAR) break;
        t += h;
        if(abs(h)<.35) accum += (.35-abs(h))/24.;
        
    }

    return min(t, FAR);
}
float sha(in vec3 ro, in vec3 rd, in float start, in float end, in float k){

    float shade = 1.0;
    const int maxIterationsShad = 24; 

    float dist = start;
    float stepDist = end/float(maxIterationsShad);

    for (int i=0; i<maxIterationsShad; i++){
        float h = map(ro + rd*dist);
        shade = min(shade, smoothstep(0.0, 1.0, k*h/dist));

        dist += clamp(h, 0.01, 0.2);
        if (abs(h)<0.001 || dist > end) break; 
    }
    
    return min(max(shade, 0.) + 0.4, 1.0); 
}
    const vec2 e = vec2(0.001, 0);
float n3D(vec3 p){
    
	const vec3 s = vec3(7, 157, 113);
	vec3 ip = floor(p); p -= ip; 
    vec4 h = vec4(0., s.yz, s.y + s.z) + dot(ip, s);
    p = p*p*(3. - 2.*p); 
    h = mix(fract(sin(h)*43758.5453), fract(sin(h + s.x)*43758.5453), p.x);
    h.xy = mix(h.xz, h.yw, p.y);
    return mix(h.x, h.y, p.z); 
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;
    float speed = 4.;
    vec3 o = camPath(iTime*speed);
    vec3 lk = camPath(iTime*speed + .25);
    vec3 l = camPath(iTime*speed + 2.) + vec3(0, 1, 0);
    float FOV = 3.14159/2.; 
    vec3 fwd = normalize(lk-o);
    vec3 rgt = normalize(vec3(fwd.z, 0, -fwd.x )); 
    vec3 up = cross(fwd, rgt);
    vec3 r = fwd + FOV*(u.x*rgt + u.y*up);
    r = normalize(vec3(r.xy, (r.z - length(r.xy)*.125)));
    float t = trace(o, r);
    vec3 col = vec3(0);
    if(t<FAR){
        vec3 p = o + r*t;
        vec3 n = nr(p);
        vec3 svn = n;
        float sz = 1./3.; 
        l -= p; 
        float d = max(length(l), 0.001);
        l /= d;
        
        float at = 1./(1. + d*.05 + d*d*.0125);
        float ao =  cao(p, n);
        float sh = sha(p, l, 0.04, d, 16.);
        float di = max(dot(l, n), 0.);
        float sp = pow(max( dot( reflect(r, n), l ), 0.), 64.); 
        float fr = clamp(1.0 + dot(r, n), .0, 1.);
        vec3 tx = vec3(.05);
        col = tx*(di*.1 + ao*.25) + vec3(.8, .1, .2)*sp*2. + vec3(.5, .2, .8)*pow(fr, 8.)*1.25;
        col = mix(col.xzy, col, di*.185 + .515);
        vec3 accCol = vec3(0, 1.3, 4.91)*accum;
        vec3 gc = pow(min(vec3(1.5, 1, 1)*accum, 1.), vec3(10, 9.5, 45.))*.5 + accCol*.05;
        col *= ao*sh*at;
        
    }
    vec3 fog = vec3(.125, .04, .05)*(r.y*.5 + .5);    
    col = mix(col, fog, smoothstep(0., .95, t/FAR));

    u = fragCoord/iResolution.xy;
    col = mix(vec3(0), col, pow( 16.0*u.x*u.y*(1.0-u.x)*(1.0-u.y) , .125)*.5 + .5);

    fragColor = vec4(sqrt(clamp(col, 0., 1.)), 1);
 
}
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}