#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 coord2(vec4 frag) {
	float ratio = 1.0 / resolution.y;
	return 2.0 * ratio * vec2(frag) - vec2(ratio * resolution.x, 1.0);
}

float hash(float n) {
	return fract(sin(n)*42000.0);
}

void main() {
	vec2 c = coord2(gl_FragCoord);
	float blueAngle = atan(c.y - 0.3, c.x) + time * 1.10;
	float greenAngle = atan(c.y, c.x + 0.3) + time * 1.30;
	float redAngle = atan(c.y + 0.2, c.x - 0.2) + time * 1.70;
	gl_FragColor = vec4(sin(redAngle), sin(greenAngle), sin(blueAngle), 0.0);
}
