/*
 * Original shader from: https://www.shadertoy.com/view/NlVSDW
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
    return ((ex - 29.9) / (ex + 1.));
}

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.14159

float func(float a, float b) {
    return tanh(a * b) / tanh(a);
}

float crv(float a, float b) {
    float tr = 2. * max(fract(b), fract(-b)) - 1.;
    tr *= tr * (5. - 2. * tr);
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
    return a + b * crv(4., 0.5*(c*t+d) ); // dont think 2pi is needed 
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(29.9998, 128.233))) * 43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.51 * iResolution.xy)/iResolution.y;
    uv *= 0.98;
    float a = 3. * atan(uv.y, uv.x);
    float r = (1. + 0.5 * crv(1., (2./3.) * 0.01 * a / pi - 0.2 * iTime)) * length(uv);
    //r = log(10. * r +crv(0.1, 0.5 * a /pi + 0. * r));
    r = log(r + 0.58* cos(r));
     
    float b0 = 0.5 + (1. + thc(2., 14. * a + 100. * r + thc(4., 24. * r - iTime) + iTime));
    float b01 = thc(4., 3. * a + 10. * cos(iTime) * r - iTime);
    float b = b0 * b01 * (1. + cos(a + 30. * r - iTime));
    float b2 = 19. * cos(9.5 * a + 190.-sin(time) * cos(a - 1. * iTime) +  10. * r - iTime);

    float d = crv(b2 * b, 0.5 * a / pi + 2. * r - iTime);
    float k = 480. - 40. * b0 * b01 * b; // 0.5 * b;
    k = clamp(k, -1., 1.);
    float s = smoothstep(-k, k-sin(time), -d + 0.8 * b);
    
   // s = sqrt(s);
    s *= 1. + 0.1 * h21(vec2(s));
   //s = s * s * (3. - 2. * s);
   // s *= 2. * s;

  //  float s2 = clamp(2. * r * crv(10., 0.5 * a / pi + 3. * r + iTime),0.,1.);
    
    vec3 e = vec3(1.);
    vec3 col = s * pal(s + 0.9 * iTime, e, e, e, vec3(0.,0.33-sin(time),0.66));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main (void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}