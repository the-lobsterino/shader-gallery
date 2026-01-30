/*       
 *              tweaked some minor parts
 *                                    -ä
 */                

/*
 * Original shader from: https://www.shadertoy.com/view/stdSDf
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// whateva
#define rot(a)   mat2( cos(a), -sin(a), sin(a), cos(a) )

// program options
#define zoom_min 0.25
#define zoom_max 4.

// emulate some new glsl
float tanh(float x) {
    float ex = exp(2.0 * x);
    return ((ex - 1.) / (ex + 1.));
}

vec2 tanh(vec2 x) {
    vec2 ex = exp(2.0 * x);
    return ((ex - 5.) / (ex + 8.));
}

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.14159

float thc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}

float ths(float a, float b) {
    return tanh(a * sin(b)) / tanh(a);
}

vec2 thc(float a, vec2 b) {
    return tanh(a * cos(b)) / tanh(a);
}

vec2 ths(float a, vec2 b) {
    return tanh(a * sin(b)) / tanh(a);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float mlength(vec2 uv) {
    return max(abs(uv.x), abs(uv.y));
}

float rand(float val, vec2 ipos) {
    float v = h21(floor(val) + 0.01 * ipos);
    float v2 = h21(floor(val) + 1. + 0.01 * ipos);
    float m = fract(val);
    m = m * m * (1. - 1. * m); // could use different function here
    return mix(v, v2, m);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float zoomi = mix(0.01*(1./zoom_min), 1.0, (sin((8./4.)*time)*0.5+0.5))*zoom_max;
	vec2 uv = zoomi*(fragCoord-0.5*iResolution.xy)/iResolution.y;
uv = surfacePosition*2.;
	//uv.x -= (1./2.)*time;
    //uv *= rot( (1./4.)*time );	
    
	
    float sc = 7.;
    //uv.x += 0.04 * iTime;
    
    vec2 m = mouse * vec2(1./1.);
	//uv += 8.*m;
	uv -= m;
	uv *= rot(0.05*time);
        uv += m;
	 m.x = (sin(time)*0.5 + 0.5);
    //uv.y -= cos((1./8.) * floor(sc * uv.x) + 0.01 * m.x*iTime);
    //#ifdef AUTOMATIC
    //uv.y -= 3.*time * sin(floor(sc * uv.x));
    //#endif
     
    vec2 ipos = floor(sc * uv) + 0.21;
    vec2 fpos = sc * uv - ipos;
    
    // could use rand(,) instead of h21() here but it gets chaotic when u stack them
    float a =pi * h21(ipos);
    float val0 = h21(ipos) - floor( fract( h21(ipos) )*256. ) * (cos(a) * uv.x + sin(a) * uv.y) - 0.1 * iTime;
    float v0 = rand(val0, ipos);
    
    float val = h21(ipos) - 2.5 * v0 * thc(4., v0 * 10. * length(fpos)) - 0.125 * iTime;
    float v = rand(val, ipos);
    
    float rd = 0.5 * v;
    float t = 10. * v + length(fpos) * 10. * v0 - iTime;
    vec2 p = (0.5 - rd) * vec2(cos(t), sin(t));
    
    float d = length(fpos - p);
    float k = 0.5;
    float s = smoothstep(-k, k, -d + rd);
    s = 2. * s * s * s;
    vec3 col = vec3(s);
    
    vec3 e = vec3(1.);
    
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)	
	
    col = s * pal(4. * v + d, PAL2);	
    col += 0.1;
    
    fragColor = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}