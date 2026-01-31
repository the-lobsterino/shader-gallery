#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


void main(void)
{
    float t = time / 3.;
    vec2  u = ( gl_FragCoord.xy + gl_FragCoord.xy - resolution ) / resolution.y;
    float h = length(u);
    u /= dot(u,u);
    float w = .3,
    r = ceil(u.x/w+.8*t)+ceil(u.y/w+.8*t),
    m = mod(r, 4.),
    v = m > 1. ? u.x : u.y,
    b = step(fract(v/w), .5);
    gl_FragColor =vec4(vec3(b)*(h*h)*5., 1.);
	
}  