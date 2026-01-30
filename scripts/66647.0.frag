#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const vec3 tint = vec3(0.1, 0.9, 0.4);
const vec3 bgColor = vec3(1.0, 1.0, 1.0);

#define MODE_2
#define ITERATIONS 100.0

void main() {
	vec2 p = 
		(4.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y)
		;

	for(float i = 1.0; i < ITERATIONS; i++) {
		p.x += 1.0 / i * sin(i * p.y) + 1.0 + (time * 0.5);
		p.y += mouse.y * 2.0 / i * cos(i * p.x);
	}

	vec3 col;
	col = vec3(sin(p.x), cos(p.y + time), sin(p.x));

	gl_FragColor = vec4(col, 1.0);
}
