//isnt this neat
//ඞ sussy guy
precision mediump float;
uniform float time;
uniform vec2 resolution, mouse;
#define R(t) mat2(cos(3. * t + vec4(0, 33, 11, 0)))
void main()
{
    vec2 u = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
    vec3 p, d;
	d = normalize(vec3(u, dot(u, u) - 7.5));
	d = normalize(vec3(u, 0.1*u - .5));
    d.xy *= R(mouse.x); d.yz *= R(mouse.y);
    float t = -10.;
    for (int i = 100; i > 0; --i)
    {
	t += min(min(length(p.xy), length(p.xz)), length(p.yz))- .1;
        p = fract(vec3(5, 7, .3 * time) + d * t) - .5;
    }
    gl_FragColor = vec4(d*p*3. +.1*t, 1);
}