precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	float width = 300.0, height = 200.0;
	float wpad = width + 20.0, hpad = height + 20.0;

	vec2 pos = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	if (resolution.x / wpad > resolution.y / hpad) {
		pos.x *= resolution.x / resolution.y;
		pos *= hpad;
	} else {
		pos.y *= resolution.y / resolution.x;
		pos *= wpad;
	}
	if (abs(pos.x) > width || abs(pos.y) > height) {
		discard;
	}

	if (distance(gl_FragCoord.xy / resolution, mouse) < 0.01) {
		gl_FragColor = vec4(0, 1, 0, 1);
		return;
	}
	gl_FragColor = vec4(1, 1, 1, 1);
}
