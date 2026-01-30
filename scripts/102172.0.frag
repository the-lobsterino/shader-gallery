/*
 * Original shader from: https://www.shadertoy.com/view/sdlfRl
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

float mlength(vec3 uv) {
    return max(max(abs(uv.x), abs(uv.y)), abs(uv.z));
}

float smin(float a, float b)
{
    float k = 0.12;
    float h = clamp(0.5 + 0.5 * (b-a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec2 ouv = uv;
      
    float m = 0.16;
    float th = 0.8 * iTime;
    const float n = 4.; // other values look cool too
    vec2 id = vec2(1.);
    for(float i = 0.; i < n; i++) {      
        uv *= Rot(2. * pi * h21(id) + length(ouv) + 0.2 * iTime);
       
        id *= 0.5;
        id += vec2(step(uv.x, 0.), step(uv.y, 0.));
        
        th += 0.5 * pi / n * cos(th); // can remove cos(th)
        
        vec2 p = 0.5 * vec2(thc(8., th), ths(8., th)) - 0.5;
        uv = abs(uv - 0.5 * m * abs(p) + 0. * m) - m;
        m *= 0.5;
    }
       
    // maybe dont include 0.1*length(ouv)
    float h = h21(id + floor(h21(id) + 0.1 * length(ouv) + 0.2 * iTime));
    h = smoothstep(0., 1., h);
    
    float d = length(uv);
    float k = 2.4;//mix(0.1, 2., 0.5 + 0.5 * thc(3., 2. * pi * h + iTime)); //1./iResolution.y;
    float s = smoothstep(-k, k, -d + 2.* m); //2m not needed
     
    vec3 e = vec3(1.);
    vec3 col = s * pal(0.4 * ouv.y + h, e, e, e, 0.45 * vec3(0,1,2)/3.);
    col = sqrt(col);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}