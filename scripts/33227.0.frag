precision highp float;

uniform vec2 mouse;
uniform vec2 resolution;

// Inspired by: https://gist.github.com/sakrist/8706749
float hex(vec2 p) {
	p.x *= 1.15;
	p.y += fract(floor(p.x) * 0.5);
	p = abs((fract(p) - 0.5));
	return abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0);
}

void main(void) {
	vec2 pos = 2.0 * gl_FragCoord.xy / resolution.y - resolution / resolution.y - 2.0 * mouse;
	pos *= 6.0;

	vec3 col = smoothstep(0.0, 0.1, hex(pos) * vec3(0.8, 1.0, 0.5));
	gl_FragColor = vec4(col, 1.0);
}