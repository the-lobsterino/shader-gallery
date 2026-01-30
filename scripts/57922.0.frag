precision mediump float;

uniform vec2 resolution;
uniform float time;

float cross(vec2 v1, vec2 v2) {
	return v1.x * v2.y - v1.y * v2.x;
}

bool segment(vec2 p, vec2 p0, vec2 p1, float w) {
	vec2 s = p1 - p0;
	vec2 a = p - p0;
	vec2 b = p - p1;
	float r = w / 2.0;
	float d = length(cross(s, a)) / length(s);
	if (d <= r) {
		if (dot(a, s) * dot(b, s) <= 0.0) {
			return true;
		}
	}
	return false;
}

void main() {
	vec2 pos = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	if (resolution.x > resolution.y) {
		pos.x *= resolution.x / resolution.y;
	} else {
		pos.y *= resolution.y / resolution.x;
	}

	pos *= 110.0;
	if (abs(pos.x) > 100.0 || abs(pos.y) > 100.0) {
		discard;
	}

	float speed = 200.0;
	
	// sec
	{
		float s = mod(floor(time * speed), 60.0);
		float rad = radians(s * 6.0);
		vec2 p1 = vec2(sin(rad), cos(rad)) * 90.0;
		if (segment(pos, vec2(0, 0), p1, 2.5)) {
			gl_FragColor = vec4(0, 0, 0, 1);
			return;
		}
	}

	// min
	{
		float m = mod(time * speed / 60.0, 60.0);
		float rad = radians(m * 6.0);
		vec2 p1 = vec2(sin(rad), cos(rad)) * 60.0;
		if (segment(pos, vec2(0, 0), p1, 5.0)) {
			gl_FragColor = vec4(0, 0, 0, 1);
			return;
		}
	}

	for (int i = 0; i < 12; i++) {
		float rad = radians(float(i) * 30.0);
		vec2 p = vec2(sin(rad), cos(rad)) * 90.0;
		if (distance(p, pos) < 5.0) {
			gl_FragColor = vec4(1, 0.5, 0, 1);
			return;
		}
	}

	gl_FragColor = vec4(1, 1, 1, 1);
}
