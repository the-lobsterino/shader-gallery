precision mediump float;
uniform float time;
uniform vec2 resolution, mouse;
#define R(t) mat2(cos(3. * t + vec4(0, 33, 11, 0)))
void main()
{
    vec2 u = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
    vec3 p, d = normalize(vec3(u, dot(u, u) - .25));
    d.xy *= R(mouse.x); d.yz *= R(mouse.y);
    float t = 0.;
    for (int i = 100; i > 0; --i)
        p = fract(vec3(0, 0, .3 * time) + d * (t += min(min(length(p.xy), length(p.xz)), length(p.yz)) - .05)) - .5;
    gl_FragColor = vec4(p + .3 * t - dot(u, u), 1);
}