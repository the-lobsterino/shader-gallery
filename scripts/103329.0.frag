/*
 * Original shader from: https://www.shadertoy.com/view/clyGR3
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate some GLSL ES 3.x
float tanh(float x) {
    float ex = exp(2.0 * x);
    return ((ex - 1.) / (ex + 1.));
}
float cosh (float x) {
  return 0.5 * (exp(x) + exp(-x));
}

// --------[ Original ShaderToy begins here ]---------- //
// Thanks to (everyone I've copied code + ideas from):
// TheArtOfCode - raymarching
//  BlackleMori - hash, erot
//      Sizertz - AO, shadow
//        NuSan - materials
//        Tater - raymarching
//         Leon - raymarching hash trick
//           iq - pal, smin, most things!

#define tau 6.2831853071
#define pi 3.1415926535
#define thc(a,b) tanh(a*cos(b))/tanh(a)
#define ths(a,b) tanh(a*sin(b))/tanh(a)
#define pal(a,b) .5+.5*cos(2.*pi*(a+b))
#define sabs(x) sqrt(x*x+1e-2)
//#define sabs(x, k) sqrt(x*x+k)
#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

vec3 erot(vec3 p, vec3 ax, float ro) {
  return mix(dot(ax, p)*ax, p, cos(ro)) + cross(ax,p)*sin(ro);
}

float cc(float a, float b) {
    float f = thc(a, b);
    return sign(f) * pow(abs(f), 0.25);
}

float cs(float a, float b) {
    float f = ths(a, b);
    return sign(f) * pow(abs(f), 0.25);
}

float h21(vec2 a) { return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float mlength(vec2 uv) { return max(abs(uv.x), abs(uv.y)); }
float mlength(vec3 uv) { return max(max(abs(uv.x), abs(uv.y)), abs(uv.z)); }

float smin(float a, float b, float k) {
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k/4.;
}

/*
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0., 1.);
    return mix(b, a, h) - k * h * (1. - h);
}//*/

float smax(float a, float b, float k) {
    float h = clamp(0.5 - 0.5 * (b - a) / k, 0., 1.);
    return mix(b, a, h) + k * h * (1. - h); 
}

#define MAX_STEPS 400
#define MAX_DIST 100.
#define SURF_DIST .001

vec3 ori() {
    vec2 m = iMouse.xy/iResolution.xy;
    vec3 ro = vec3(0, 3, 3);
    ro.yz *= rot(pi/4. + pi/16. * cos(0.4 * iTime));
    //ro.yz *= rot(-m.y*3.14+1.);
    //ro.xz *= rot(-m.x*6.2831);
    return ro;
}

vec2 map(vec3 p) {
    vec3 q = p;
    float t = iTime;
    float m = 0.5;
    p.yz -= 2.* t;
    p *= 0.5;
    vec3 ip = floor(p) + 0.5;
    t += ip.x + ip.y + ip.z;
    p = fract(p) - 0.5;// p = mod(p, 1.5) - 0.75;
    for (float i = 0.; i < 3.; i++) {
        p = abs(p) - m;
        m *= 0.5;
        p.xz *= rot(t);
        p.yz *= rot(t);
    }
    //p = mod(p, 1.5) - 0.75;
    float d = mlength(p) - 0.04 + 0.08 * cos(ip.x);
    d += 0.04 * cos(100. * (ip.z+ip.y) + iTime);

    float x = 8.;
    float r = 1.5 + 9. * (1.-tanh(0.07 + 0.06 * iTime));
    d = smin(d, length(q - vec3(0,0,-9. + cos(0.8 * iTime))) - r, r - 1.4);

    return vec2(d, 0);
}

vec3 march(vec3 ro, vec3 rd, float z) {	
    float d = 0.;
    float s = sign(z);
    int steps = 0;
    float mat = 0.;
    for(int i = 0; i < MAX_STEPS; i++) {
    	vec3 p = ro + rd * d;
        vec2 m = map(p);
        if (s != sign(m.x)) { z *= 0.5; s = sign(m.x); }
        if (abs(m.x) < SURF_DIST || d > MAX_DIST) {
            steps = i + 1;
            mat = m.y;
            break;
        }
        d += m.x * z; 
    }   
    return vec3(min(d, MAX_DIST), steps, mat);
}

vec3 norm(vec3 p) {
	float d = map(p).x;
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        map(p-e.xyy).x,
        map(p-e.yxy).x,
        map(p-e.yyx).x);
    
    return normalize(n);
}

vec3 dir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}

float AO(in vec3 p, in vec3 n) {
	float occ = 0.;
    float sc = 1.;
    for (float i = 0.; i < 5.; i++) {
        float h = 0.015 + 0.015 * i;
        float d = map(p+h*n).x;
        occ += (h-d)*sc;
        sc *= 0.95;
    }
    return clamp(1. - 3.*occ, 0., 1.);
}

float shadow(in vec3 ro, in vec3 rd) {
    float res = 1.;
    float t = SURF_DIST;
    for (int i=0; i<24; i++)
    {
		float h = map(ro + rd * t).x;
        float s = clamp(32. * h / t, 0., 1.);
        res = min(res, s);
        t += clamp(h, 0.01, 0.2);
        if(res<SURF_DIST || t>MAX_DIST ) break;
    }
    res = clamp(res, 0.0, 1.0);
    return smoothstep(0., 1., res);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	
    vec3 ro = ori();
    
    vec3 rd = dir(uv, ro, vec3(0), tanh(0.02 + 0.03 * iTime));
    vec3 col = vec3(0);
   
    vec3 m = march(ro, rd, 1.);  
    float d = m.x;    
    vec3 p = ro + rd * d;
    
    if (d<MAX_DIST) {        
        vec3 n = norm(p);
        vec3 r = reflect(rd, n);        

        vec3 ld = -rd;// normalize(vec3(1,2,3) );
      //  ld.xz *= rot(1.*p.y + iTime);
        float dif  = dot(n,  ld)*.5+.5;
        float spec = pow(dif, 2048.);
        float fres = pow(1. + dot(rd, n),  5.);
     
        col = vec3(spec); 
      //  col = clamp(col, 0., 1.);
        //col *= mix(vec3(1,0,0), vec3(0,0,1), 1.-exp(-0.04*dot(p,p)));
    }
    
    float osc = 0.5 + 0.5 * thc(12., 0.005 * p.z + 0.6 * iTime);
    osc = 1.-tanh(0.08 * iTime);
    vec3 bg = vec3(1,0,0) + exp(-20.* osc * abs(rd.x));
    
    col = mix(col, bg, 1.-1. / cosh(0.012*dot(p,p))); //0.02
    col.b *= mix(1., exp(-0.00015*m.y*m.y), tanh(0.04 * iTime));
    col.b = tanh(3.5 * col.b);
    col = mix(col, bg, 1.-1. / cosh(0.012*dot(p,p)));
    col = pow(col, vec3(1./2.2));	// gamma correction
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}