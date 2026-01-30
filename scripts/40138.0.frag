#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 position = gl_FragCoord.xy;
	float radius = 800.0 + 325.0 * pow((0.5 + sin(2.0 * 3.14 * time) / 2.0), 4.0);
	float color = float(sqrt(pow(position.x - resolution.x / 2.0, 2.0) + pow(position.y - resolution.y / 2.0, 2.0)) < radius);
	gl_FragColor = vec4(vec3(color, color * 0.5, sin(color + time / 3.0) * 0.75), 1.0);
}