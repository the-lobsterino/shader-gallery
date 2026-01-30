precision mediump float;

uniform float time;
uniform vec2 resolution;

float cross(vec2 v1, vec2 v2) {
	return v1.x * v2.y - v1.y * v2.x;
}

bool segment(vec2 p, vec2 p0, vec2 p1, float w, bool r_edge) {
	vec2 s = p1 - p0;
	vec2 a = p - p0;
	vec2 b = p - p1;
	float r = w / 2.0;
	float d = length(cross(s, a)) / length(s);
	if (d <= r) {
		if (dot(a, s) * dot(b, s) <= 0.0) {
			return true;
		}
		if (r_edge) {
			if (length(a) < r || length(b) < r) {
				return true;
			}
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

	if (segment(pos, vec2(-75, 75) + (10.0 * sin(time)), vec2(75, -75) * sin(time), 20.0, true)) {
		gl_FragColor = vec4(sin(time), 0, -sin(time), 1);
		return;
	}
	if (segment(pos, vec2(-75, -75) + (10.0 * sin(time)), vec2(75, 75), 10.0, false)) {
		gl_FragColor = vec4(sin(time), sin(time), 0, 1);
		return;
	}

	gl_FragColor = vec4(1, 1, 1, 1);
}
