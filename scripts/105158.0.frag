/*
 * Original shader from: https://www.shadertoy.com/view/fdfBzj
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
    float h = clamp(5.5 + 0.5 * (b-a) / k, 0.1, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float blob(vec2 uv, float o) {
    float d = 10.;
    for (float i = 0.; i < 12.; i++) {
        float e = 0.01 * i;
        float hx = h21(vec2(e + o, 1.-e));
        float hy = h21(vec2(e + 1., e - o));
        vec2 p = 0.45 * (0.5 - vec2(hx, hy));
        d = smin(d, (1.5 - 0.5 * hx) * length(uv - p));
    }
    return d;
}

// todo:
// stretch hx/hy so u get stretched blobs not in a square

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    float time = 0.4 * iTime;
    
    float sc = 8.;
    vec2 ipos = floor(sc * uv) + 0.5;
    vec2 fpos = sc * uv - ipos;

    float h = h21(ipos);
    float o = 0.01 * floor(time + h);
    float d = blob(fpos, o + h);
    
    float k = 6. / iResolution.y;
    float s = smoothstep(-k, k, abs(-d + 0.05) - 0.05);
    s *= smoothstep(-k, k, smin(-abs(fpos.x), -abs(fpos.y)) + 0.45);
    vec3 e = vec3(1.);
    vec3 col = s * pal(0.12 * fpos.y - 0.2 + floor(3. * h) / 3. + floor(time + h)/3., 
                       e, e, e, 0.45 * vec3(0,1,2)/3.);
    col += 0.08;
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}