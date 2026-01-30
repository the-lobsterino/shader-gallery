//trippy right
//ඞ sussy guy
precision mediump float;
uniform float time;
uniform vec2 resolution, mouse;
#define R(t) mat2(cos(3. * t + vec4(0, 33, 11, 0)))
void main()
{
    vec2 u = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
    vec3 p, d;
	d = normalize(vec3(u, dot(u, u) - .5));
	d = normalize(vec3(u, 0.*u - .50));
    d.xy *= R(mouse.x); d.yz *= R(mouse.y);
    float t = 10.;
    for (int i = 50; i > 0; --i)
    {
	t += min(min(length(p.xy), length(p.xz)), length(p.yz))- 0.6;
        p = fract(vec3(6, 3, .5 * time) + d * t) - .50;
    }
    gl_FragColor = vec4(d*p*3. +.1*t, 1);
}