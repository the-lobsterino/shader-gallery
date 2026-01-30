#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EPS 0.01
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

// global variables
mat2 rot_yz;
mat2 rot_zx;

float sdLink(vec3 p, float le, float r1, float r2) {
	vec3 q = vec3(p.x, max(abs(p.y) - le, 0.0), p.z);
	return length(vec2(length(q.xy) - r1, q.z)) - r2;
}

float sdRoundBox(vec3 p, vec3 b, float r) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float map2(vec3 p) {
	return sdLink(p, 1.0, 1.0, 0.5);
}

vec3 getColor(vec3 p, vec3 n, vec3 rin) {
	// orthographic projection
	vec3 rd = refract(rin, n, 0.5);
	vec3 ro = p * 3.0;
	vec3 color = vec3(0);
	float dist = 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		p.yz *= rot_yz;
		p.zx *= rot_zx;
		float d = map2(p);
		if (d < EPS) {
			color = vec3(1, 1, 2) * (2.0 / float(i));
			break;
		}
		dist += d;
		if (dist > 20.0) {
			break;
		}
	}

	return color;
}

float map(vec3 p) {
	p.yz *= rot_yz;
	p.zx *= rot_zx;
	return sdRoundBox(p, vec3(0.9), 0.1);
}

vec3 getNormal(vec3 p) {
	const vec2 eps = vec2(EPS, 0);
	float d = map(p);
	return normalize(vec3(
		map(p + eps.stt) - d,
		map(p + eps.tst) - d,
		map(p + eps.tts) - d));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 5));
	vec3 ro = vec3(0, 0, -10);
	vec3 color = vec3(0, 0.2, 0);
	float dist = 0.0;

	rot_yz = rot((mouse.y - 0.5) * -8.0);
	rot_zx = rot((mouse.x - 0.5) * 8.0);

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			vec3 n = getNormal(p);
			color = getColor(p, n, rd);
			break;
		}
		dist += d;
		if (dist > 20.0) {
			break;
		}
	}

	gl_FragColor = vec4(color, 1);
}
