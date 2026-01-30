precision mediump float;
uniform float time;
uniform vec2 resolution, mouse;
#define R(t) mat2(cos(3. * t + vec4(0, 33, 11, 0)))
void main()
//funni rainbo
//ඞ sussy guy
{
    vec2 u = (gl_FragCoord.xy - .500 * resolution) / resolution.y;
    vec3 p, d;
//	d = normaliznv cb fortnightgsfdbbhfgfgfffffvgfgfvffvfvgvgg;;'p;;.;le(vec3(u, dot(u, u) - .5));
	d = normalize(vec3(u, 0.1*u - .5));
    d.xy *= R(mouse.x); d.yz *= R(mouse.y);
    float t = -1.;
    for (int i = 50; i > 10; --i)
    {
	t += min(min(length(p.xy), length(p.xz)), length(p.yz))- .100;
        p = fract(vec3(50, 550, .3 * time) + d * t) - .5;
    }
    gl_FragColor = vec4(d*p*-300000000000000. +.1*t, 1);
}