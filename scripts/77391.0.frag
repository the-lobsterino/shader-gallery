/*
 * Original shader from: https://www.shadertoy.com/view/NtG3RK
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

float cosh(float val)
{
    float tmp = exp(val);
    float cosH = (tmp + 1.0 / tmp) / 2.0;
    return cosH;
}

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.14159

float thc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}

float ths(float a, float b) {
    return tanh(a * sin(b)) / tanh(a);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// smoothstep from a point p
float sp(vec2 uv, float t) {
    vec2 p = 0.35 * vec2(thc(0.5, t * 0.713), ths(0.5, t));
    float d = length(uv - p);
    float k = 0.5 * d + 0.035 * length(uv);
    return smoothstep(-k, k, k - d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    
    // warp uv slightly
    uv /= 0.85 * cosh(1.1 * length(uv));

    float t = 2.5 * iTime;
    
    // length of trail (0.05 -> blobs, 3. -> noisy trail)
    float sc = 0.1; //mix(0.05, 3., .5 + .5 * cos(2. * iTime));
    
    // flick between blobs seperated/together
    float e = .5 + .5 * thc(4., -0.8 * iTime);
    
    // make 12 blobs (sc * h21 "stretches" using noise)
    float s = sp(uv, t + sc * h21(uv));
    for (float i = 1.; i < 12.; i++) {
        s = max(s, sp(uv, e * i + t + sc * h21(uv + i)));
    }
    
    vec3 col = s * pal(s, vec3(1.), vec3(1.), vec3(1.), s * vec3(0.,0.33,0.66)); 
    col += 2. * vec3(s) * vec3(0.2,0.6,0.9);
    //col = vec3(s);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}