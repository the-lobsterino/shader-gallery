#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{

    vec2 uv = gl_FragCoord.xy * 2. - resolution;
    uv.x *= resolution.x / resolution.y;

    vec3 p = vec3(uv, 2. * sin(time * 0.001));

    for (int i = 1; i < 6; i++)
    {
        p /= fract(uv.x);
        p += mod(sin(uv.x*2.0+time), 12.);
        p = p * cos(p.x) / dot(-p + 1. - .4 * sin(p.x * 3.), p - sin(p * 4.));
        p.yzx = p.xyz;
    }
    p = vec3(dot(p, vec3(0.23)), 0.1 - 0.4 * cos(p.xz * 1.3));
    gl_FragColor = vec4(p, 1);
}