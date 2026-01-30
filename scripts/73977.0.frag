/*
 * Original shader from: https://www.shadertoy.com/view/stsXWj
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

// --------[ Original ShaderToy begins here ]---------- //
const vec3 background = vec3(232.) / vec3(255.);
const vec3 green = vec3(103., 197., 42.) / vec3(255.);
const vec3 black = vec3(60., 60., 63.) / vec3(255.);

float sdLine( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

vec2 opRotate(vec2 p, float a)
{
    return mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
}

float sdC(in vec2 p, float t)
{
    {
        float a = -radians(360.) * smoothstep(0., .65, t);
        p = opRotate(p, a);
    }

    float d0 = length(p) - .50;
    float d1 = length(p) - .43;
    float d2 = length(p) - .32;

    float a = atan(p.y, p.x);
    a = abs(mod(a + .5 * radians(45.), radians(45.)) - .5 * radians(45.));

    float d = mix(d0, d1, smoothstep(-.1, .01, a - radians(14.)));
    return opSmoothSubtraction(min(d2, sdLine(p, vec2(0), vec2(1, 0)) - .16), d, .02);
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdE(in vec2 p, float t)
{
    const float w = .16;
    const float wf = .82;

    t -= .15;
    float x0 = 1.2 * ( 1. - smoothstep(-.1, .2, t - .2));
    float x1 = 1.2 * (-1. + smoothstep(.7, 1., t + .6));
    float x2 = 1.2 * ( 1. - smoothstep(0., .3, t + .0));

    float d0 = sdBox(p - vec2(x0 + 0., .12), vec2(w, .03));
    float d1 = sdBox(p - vec2(x1 + -w * (1. - wf),  .00), vec2(w * wf, .03));
    float d2 = sdBox(p - vec2(x2 + 0.,  -.12), vec2(w, .03));
    return min(min(d0, d2), d1);
}

vec3 colCE(in float scale, in vec2 p, in float t)
{
    vec3 col = background;
    col = mix(col, green, smoothstep(.5, -.5, sdC(p, t) * scale));
    col = mix(col, black, smoothstep(.5, -.5, sdE(p, t) * scale));
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float scale = .9 * iResolution.y;
    vec2 uv = (fragCoord - .5 * iResolution.xy) / scale;
    float t = mod(iTime, 2.) / 2.;

    vec3 col = vec3(0);

    for (int i = 0; i < 5; ++i)
        col += colCE(scale, uv, t + .01 * (float(i) / 5. - .5)) / 5.;

    fragColor = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}