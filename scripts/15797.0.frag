#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795
#define SQRT2 1.41421356237

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main(void)
{
	vec2 pos = ((gl_FragCoord.xy / resolution.xy) - 0.5) * 2.;
	vec3 color = vec3(0);
	
	color.g += 1. - pow(abs(sin(pos.x * 100. + time * 5.) * abs(sin(time)) + 4. - pos.y), 0.1);
	color.b += 1. - pow(abs(cos(cos(pos.x) * 2. - time * 5.) * cos(time) - (pos.y)), 0.1);
	color.r += 1. - pow(abs(cos(sin(pos.x) * 2. - time * 5.) * sin(time) - (pos.y)), 0.3);

	color += color.r + color.g + color.b * 6. * (1. + mod(rand(vec2(time, time)), 0.01));
	gl_FragColor = vec4(color, 1.);
}