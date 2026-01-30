#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define T time

float box(vec2 p) {return 1.-max(abs(p.x), abs(p.y));}

float grid(in vec2 p){ p = abs(fract(p+.5)-.5); return 2. * min(p.x, p.y); }

vec2 cInv(vec2 p, vec2 o, float r) {
    return (p-o) * r * r / dot(p-o, p-o) + o;
}

float drawLine (in vec2 p, in vec2 a, in vec2 b, in float r) {
	p -= a;
	b -= a;
	float d = length (p - b * clamp (dot (p, b) / dot (b, b), 0.0, 1.0));
    return d;
	//return smoothstep (r + 0.01, r, d); // antialiased
//	return step (d, r); // binary
}

float map(vec2 p) {
    float f;
    vec3 o = vec3(-1., 0., 1.);
    
    // head
    f = length(p-o.yz*1.3) - .5;
    
    // arms
    f = min(f, drawLine(p, vec2(-.25, .5), vec2(-1.5, .85), 1.)-.2 );
    f = min(f, drawLine(p, vec2(.25, .5), vec2(1.5, .85), 1.)-.2 );
    
    // legs
    f = min(f, drawLine(p, vec2(-.25, -.5), vec2(-.5, -1.95), 1.)-.2 );
    f = min(f, drawLine(p, vec2(.25, -.5), vec2(.5, -1.95), 1.)-.2 );
    
    // torso, neck
    f = min(f, drawLine(p, vec2(0., .25), vec2(0., -.25), 1.)-.4 );
    f = min(f, drawLine(p, vec2(0., .25), vec2(0., .75), 1.)-.2 );
    
    return 1.-f;
}

// hash without sine
// https://www.shadertoy.com/view/4djSRW
#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
//#define MOD3 vec3(.1031, .11369, .13787) // int range
float hash11(float p) {
	vec3 p3  = fract(vec3(p) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
//  1 out, 3 in...
float hash13(vec3 p3) {
	p3  = fract(p3 * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}
vec2 hash23(vec3 p3) {
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}
vec3 hash32(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float dots(vec3 p) {
    float r = .03;
    vec2 rv = r+(1.-2.*r)*hash23(floor(p));
    return max(0., 1.-length(fract(p.xy)-rv)/r);
}

void main( void ) {
    vec2 res = resolution.xy;
	vec2 p = (gl_FragCoord.xy-res/2.) / res.y;
    
    p *= 3.;
    
    float blueBox = max(0., 1.-abs(box(p))/.025);
    
    vec2 o = .2*vec2(sin(.1*T), cos(.07462*T));
    o *= 0.;
    
    //p *= 1.+dot(o, o);
    
    vec2 pinAt = vec2(0.);
    
    p -= pinAt;
    p = p / dot(p, p) - o;
    p = p / dot(p, p);
    p += pinAt;
    
    float f=0.;
    
    //f = max(box(p), .1*grid(p));
    
    vec3 cpos = vec3(0., 0., 0.);
	vec3 cdir = vec3(p, 1.);
    
    cpos.x += mouse.x+time * 0.3;
    //cdir.z += T;
    
    const float I = 16.;
    for(float i=1.; i<=I; i++){
        //float pw = pow(2., i);
        vec3 hit = cpos + i * cdir;
    	f += dots(vec3(hit)) * (1.-i/I);
    }
    
	//f = map(p);
    float aa = 4.*fwidth(f);
    //f = smoothstep(1.-aa, 1., f);
    
    //fo = vec4(vec3(f)+vec3(0.,0.,blueBox), 1.0);
    gl_FragColor = vec4(vec3(f)*vec3(1.05, 1., 1.2), 1.0);
}