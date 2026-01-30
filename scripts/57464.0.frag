precision mediump float;

uniform vec2 resolution;

void main() {
	vec2 pos = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	if (resolution.x > resolution.y) {
		pos.x *= resolution.x / resolution.y;
	} else {
		pos.y *= resolution.y / resolution.x;
	}

	if (length(pos) < 1.0) {
		gl_FragColor = vec4(pos.xy, 0, 1);
	} else {
		discard;
	}
}
