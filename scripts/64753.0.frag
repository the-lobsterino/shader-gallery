/*
 * Original shader from: https://www.shadertoy.com/view/tdG3zV
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 700
#define MIN_DIS .01
#define STEP_SIZE .075

#define PI 3.141592

#define DISP 1.

#define MIN_SHADOW .1
#define MAX_SHADOW .2

#define AO_SAMPLES 1.
#define AO_INTENSITY 1.

#define T iTime*.5
#define L_P vec3(0., 10., 100.)
#define SHININNESS 16.

#define B vec3(.1)
#define W vec3(1.)
#define C1 vec3(.0, .1, .0)
#define C2 vec3(.0, .6, .0)

float hash21(in vec2 p)
{
    return fract(sin(dot(p, vec2(23.1, 98.3))) * 65192.8);
}

float plane(in vec3 p)
{
    float h21 = hash21(floor(p.xz))*DISP;
    h21 += (sin((p.x*.1)+T)*cos((p.z*.1)+T))*2.5;
    return p.y-h21;
}

float scene(in vec3 p)
{
    return plane(p);
}

vec3 normal(in vec3 p)
{
    vec2 e = vec2(.01, 0.);
    float d = scene(p);
    vec3 n = d - vec3(scene(p-e.xyy), scene(p-e.yxy), scene(p-e.yyx));
    return normalize(n);
}

float phong(in vec3 p, in vec3 n, in vec3 o)
{
    vec3 ld = normalize(L_P - p);
    vec3 vd = normalize(o - p);
    vec3 hv = normalize(ld + vd);
    
    float Kd = max(dot(n, ld), 0.);
    float Ks = pow(max(dot(n, hv), 0.), SHININNESS);
    
    return Kd+Ks;
}

float hShadow(in vec3 o)
{
    vec3 d = normalize(L_P - o);
    float t = MIN_SHADOW;
    for (int i = 0; i < 1; i+=0)
    {
        float s = scene(o + d * t);
        if (s < .01)
            return 0.5;
        if (t > MAX_SHADOW)
            break;
        t += s;
    }
   	return 1.;
}

float ambientOcclusion(in vec3 p, in vec3 n)
{
    float s = 1. / AO_SAMPLES;
    float ao = clamp((s-scene(p + n * s))*AO_INTENSITY, 0., 1.);
    return 1. - ao / AO_SAMPLES;
}

float shade(in vec3 p, in vec3 o)
{
    vec3 n = normal(p);
    float ph = phong(p, n, o);
    float a = .25;
    float s = hShadow(p);
    s = pow(s, 2.);
    float ao = ambientOcclusion(p, n);
    return clamp(ph*s + a*ao, 0., 1.);
}

float marcher(in vec3 o, in vec3 d)
{
    float t = 0.;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        float s = scene(o + d * t);
        if (s < MIN_DIS)
            return t;
        t += s*STEP_SIZE;
    }
    return -1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy * 2. - 1.;
    uv.x *= iResolution.x/iResolution.y;
    
    vec2 ms = iMouse.xy/iResolution.xy*2.-1.;
    ms.x *= iResolution.x/iResolution.y;

    vec3 col = vec3(0.);
    float h = 12.;
    vec3 o = vec3(ms.x*5., h, 0.);
    vec3 t = vec3(0., h-2.+ms.y*5., h/2.);
    vec3 f = normalize(o-t);
    vec3 r = cross(vec3(0., 1., 0.), f);
    vec3 u = cross(f, r);
    
	vec3 d = uv.x*r + uv.y*u - f;

    float m = marcher(o, d);
    if ( m > -1.)
    {
        vec3 p = o + d * m;

        float h21 = hash21(floor(p.xz));
        col += shade(p, o);
        vec3 C = abs(vec3(sin(T), 0., cos(T)));
        if (h21 < .94)
          	col *= B;
        else if (h21 >= .94 && h21 < .96)
            col *= C1+C;
        else if (h21 >= .96 && h21 < .98)
            col *= C2+C;
        else if (h21 >= .98)
            col *= W;
    }
    
    fragColor = vec4(sqrt(col), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}