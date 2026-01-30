/*
 * Original shader from: https://www.shadertoy.com/view/7dBfDt
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

// Emulate some GLSL ES 3.x
float tanh(float x) {
    float ex = exp(2.0 * x);
    return ((ex - 1.) / (ex + 1.));
}

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.14159

#define thc(a,b) tanh(a*cos(b))/tanh(a)
#define ths(a,b) tanh(a*sin(b))/tanh(a)
#define sabs(x) sqrt(x*x+1e-2)
//#define sabs(x, k) sqrt(x*x+k)-0.1

#define Rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

float cc(float a, float b) {
    float f = thc(a, b);
    return sign(f) * pow(abs(f), 0.25);
}

float cs(float a, float b) {
    float f = ths(a, b);
    return sign(f) * pow(abs(f), 0.25);
}

vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b*cos( 6.28318*(c*t+d) );
}

float h21(vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float mlength(vec2 uv) {
    return max(abs(uv.x), abs(uv.y));
}

float mlength(vec3 uv) {
    return max(max(abs(uv.x), abs(uv.y)), abs(uv.z));
}

float smin(float a, float b) {
    float k = 0.12;
    float h = clamp(0.5 + 0.5 * (b-a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float h21 (vec2 uv, float sc) {
    uv = mod(uv, sc);
    return fract(sin(dot(uv, vec2(12.9898, 78.233)))*43758.5453123);
}

float line(vec2 uv, float width) {
    return max(-uv.y + width, abs(uv.x));
}

float curve(vec2 uv) {
    return abs(length(uv-0.5) - 0.5);
}

float shape(vec2 uv, vec4 h, float width) {
    if (h.x + h.y + h.z + h.w == 0.)
        return 0.;
         
    // center circle to round off line segments
    float d = length(uv);     
         
    // draw line segment from center to edge (-width offset for center circle)
    d = mix(d, min(d, line(uv,     width)), h.x);
    d = mix(d, min(d, line(uv.yx,  width)), h.y);
    d = mix(d, min(d, line(-uv,    width)), h.z);
    d = mix(d, min(d, line(-uv.yx, width)), h.w);
    
    // draw quarter circle between 2 edges
    d = mix(d, min(d, curve(vec2(uv.x, uv.y))),   h.x * h.y);
    d = mix(d, min(d, curve(vec2(uv.x, -uv.y))),  h.y * h.z);
    d = mix(d, min(d, curve(vec2(-uv.x, -uv.y))), h.z * h.w);
    d = mix(d, min(d, curve(vec2(-uv.x, uv.y))),  h.w * h.x);
    
    float k = 6./iResolution.y;
    return smoothstep(-k, k, -d + width);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
        
    // change me!
    float width = 0.25;
    float threshold = 0.5;  
    
    float sc = 18.;
    // uv.x = abs(uv.x);
    // uv += floor(iTime)/sc;
        
    uv.x += 10. + 0.1 * iTime;    
        
    vec2 ipos = floor(sc * uv) + 0.;
    vec2 fpos = fract(sc * uv) - 0.5;
    
    // arbitrary values - hash repetition, offset
    float rep = 302.; 
    float val = 0.01;   
    
    // Checkerboard pattern:
    // black cells choose edges for themselves + white cells
    // white cells look at black cells to find edges
    // construct pattern for cell based on edge configuration
    float s = 0.;
    if (mod(ipos.x + ipos.y, 2.) == 0.) {
        vec4 h = vec4(h21(ipos,            rep),  // up
                      h21(ipos + val,      rep),  // right
                      h21(ipos + 2. * val, rep),  // down
                      h21(ipos + 3. * val, rep)); // left ( I think* )
        h = step(h, vec4(threshold));
        s = shape(fpos, h, width);
    } else {
        vec4 h = vec4(h21(ipos + vec2(0,1) + 2. * val, rep),  // up's down
                      h21(ipos + vec2(1,0) + 3. * val, rep),  // right's left
                      h21(ipos - vec2(0,1),            rep),  // down's up
                      h21(ipos - vec2(1,0) + val,      rep)); // left's right
        h = step(h, vec4(threshold));
        s = shape(fpos, h, width);        
    }
    
    vec3 e = vec3(1);
    vec3 col = s * pal(0.63 + 0.2 * uv.y, e, e, e, 0.15 * vec3(0,1,2)/3.);
    col += (1.-s) * pal(0.57 + 0.23 * uv.y, e, e, e, 0.15 * vec3(0,1,2)/3.);
   // col = vec3(s,0,0.22);
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}