// 070820N 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define ITERATIONS 36.0
void main() {
	vec2 p = (4.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);

	for(float i = 1.0; i < ITERATIONS; i++) {
		p.x += .1 / i * sin(i * p.y * p.x * 2.);
		p.y += .1 / i * cos(i * (p.x * p.x - p.y*p.y));
	}

	vec3 col;
	col = vec3(sin(p.x+ time), cos(p.y + time), sin(p.x- time));
	gl_FragColor = vec4(col, 1.0);
}
