/*
 * Original shader from: https://www.shadertoy.com/view/stKGDz
 */

#ifdef GL_ES
precision mediump 
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

float mlength(vec2 uv) {
    return max(abs(uv.x), abs(uv.y));
}

#define pi 3.14159

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    uv.y += 0.08 * thc(2., 10. * mlength(uv) +
    + iTime);
    //uv.y += 0.01 * cos(100. * mlength(uv) + iTime);
    float r = length(uv);
    float a = atan(uv.y/uv.x);
   
    //uv = fract(uv / r);// + ths(1.,0.5 * iTime);
   // uv = vec2(cos(0. * r + mlength(uv) + iTime),
    //          sin(0. * a + mlength(uv) + iTime));
    uv.x = r; // * 20.;
    uv.y = a * 10.;

    float time = iTime;

    float sc = 0.5;
    vec2 ipos = floor(sc * uv) + 0.5;
    vec2 fpos = fract(sc * uv) - 0.5;
    
    float d = 0.1 * (0.5 + 0.5 * cos(iTime)) + length(fpos);
    float s = smoothstep(-0.1,0.1,0.5-d) - smoothstep(-0.1,0.1,0.42 - d);
    s *= (0.5 + 0.5 * cos(uv.x + uv.y - iTime)) * h21(ipos + floor(length(ipos) * 100. + 0.2 * time));

    vec3 col = 2. * s * pal(time + 10. * r + 0.5 * s, vec3(1.), vec3(1.), vec3(1.), vec3(0.,0.33,0.66));

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}