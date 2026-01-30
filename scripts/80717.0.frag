/*
 * Original shader from: https://www.shadertoy.com/view/NlVSDW
 */

#ifdef GL_ES
precision mediump float;
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
#define pi 3.1415950

float func(float a, float b) {
    return tanh(a * b) / tanh(a);
}

float crv(float a, float b) {
    float tr = 2. * max(fract(b), fract(-b)) - 1.;
    tr *= tr * (3. - 2. * tr);
    return func(a, 1. - func(a, tr));
}

vec3 crv(float a, vec3 v) {
    return vec3(crv(a,v.x), crv(a, v.y), crv(a, v.z));
}

float thc(float a, float b) {
    return func(a, cos(b));
}


vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b * crv(4., 6.28318*(c*t+d) ); // dont think 2pi is needed 
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy)/iResolution.y;
    uv *= 0.8;
    float a = 3. * atan(uv.y, uv.x);
    float r = (1. + 0.5 * crv(1., (2./3.) * 0.5 * a / pi - 0.2 * iTime)) * length(uv);
    //r = log(10. * r +crv(0.1, 0.5 * a /pi + 0. * r));
    r = log(r + 0.58* cos(r));
     
    float b0 = 0.5 + (1. + thc(2., 4. * a + 10. * r + thc(4., 24. * r - iTime) + iTime));
    float b01 = thc(4., 3. * a + 10. * cos(iTime) * r - iTime);
    float b = b0 * b01 * (1. + cos(a + 10. * r - iTime));
    float b2 = 10. * cos(3.5 * a + 10. * cos(a - 1. * iTime) +  10. * r - iTime);

    float d = crv(b2 * b, 0.5 * a / pi + 2. * r - iTime);
    float k = 480. - 40. * b0 * b01 * b; // 0.5 * b;
    k = clamp(k, -1., 1.);
    float s = smoothstep(-k, k, -d + 0.8 * b);
    
   // s = sqrt(s);
    s *= 0.95 + 0.1 * h21(vec2(s));
   //s = s * s * (3. - 2. * s);
   // s *= 2. * s;

  //  float s2 = clamp(2. * r * crv(10., 0.5 * a / pi + 3. * r + iTime),0.,1.);
    
    vec3 e = vec3(1.);
    vec3 col = s * pal(s + 0.1 * iTime, e, e, e, vec3(0.,0.33,0.66));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}