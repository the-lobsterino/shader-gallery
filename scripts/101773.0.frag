/*
 * Original shader from: https://www.shadertoy.com/view/csXGDl
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
// The Jitters by Kristian Sivonen (ruojake)
// CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)

float hash12(vec2 p)
{
    vec3 q = p.xyy + vec3(.1,.2,.3) + p.yxx * .2;
    q += dot(q, p.yyx * .761) - q.z;
    return fract((q.x + q.y) * .1 + (q.z - q.x) * .12 - q.z * .52);
}

float pat(vec2 p, vec2 i)
{
    float h = hash12(i);
    float t = iTime * (.2 + fract(h + .672));
    t -= pow(1. - fract(t * fract(h + .912)), 3.) * .5 * fract(h + .193); 
    float a = fract(h + .789) * 4.;
    a += (fract(h + .321) < .5 ? t : -t);
    vec2 d = vec2(sin(a),cos(a));
    return sin(dot(((p - i) * 2. - 1.) * max(h, .1) * 2., d));
}

float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 f2 = f * f;
    f = (6. * f2 - 15. * f + 10.) * f2 * f; 
    
    vec2 o = vec2(1,0);
    
    return mix(
        mix(pat(p, i), pat(p, i + o), f.x),
        mix(pat(p, i + o.yx), pat(p, i + 1.), f.x),
        f.y
    );
}

vec2 der(vec2 p, float v)
{
    const vec2 e = vec2(.2, 0);
    return normalize(
        v - vec3(
            noise(p + e),
            noise(p + e.yx),
            .2
        )
    ).xy * smoothstep(-1., 1., v);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * .5)/iResolution.y * 5.;

    float n = noise(uv);
    vec2 d = der(uv, n);
    uv += d * 3.;
    n = noise(uv);
    uv -= d * 6.;
    float m = 1.;
    
    for(int i = 0; i < 5; ++i)
    {
        uv += n / m + 3.;
        n += noise(uv) / m;
        m *= 2.;
    }
    n = n * .25 + .5;

    vec3 col = mix(vec3(.5, .1, .2), vec3(.3, .25, .3), 1. - n * n);
    float l = dot(d, vec2(.7071)) * .5 + .5;
    col = clamp(mix(col * n, vec3(.7, .75, .8), l * l * l * l) + pow(l * 1.1, 40.), 0., 1.);
    col = mix(col.ggg, col, 2.5);
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}