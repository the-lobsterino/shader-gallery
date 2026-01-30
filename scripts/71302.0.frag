#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define EPS 0.01
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdLink(vec3 p, float le, float r1, float r2) {
	vec3 q = vec3(p.x, max(abs(p.y) - le, 0.0), p.z);
	return length(vec2(length(q.xy) - r1, q.z)) - r2;
}

float map2(vec3 p) {
	p.xy *= rot(time * 0.5);
	p.yz *= rot(time * 0.4);
	return sdLink(p, 1.0, 1.0, 0.5);
}

vec3 getColor(vec3 p) {
	const float eps = 1.0 - EPS;
	vec2 uv;
	if (abs(p.x) > eps) uv = p.yz;
	if (abs(p.y) > eps) uv = p.zx;
	if (abs(p.z) > eps) uv = p.xy;

	vec3 rd = normalize(vec3(uv, 1));
	vec3 ro = vec3(0, 0, -4);
	float dist = 0.0;
	float dmin = 1.0 / 0.0;
	int j = -1;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map2(p);
		dmin = min(dmin, d);
		if (d < EPS) {
			j = i;
			break;
		}
		dist += d;
		if (dist > 20.0) {
			break;
		}
	}

	vec3 color;
	if (j >= 0) {
		color = vec3(1, 1, 2) / float(j);
	} else {
		color = vec3(1) * 0.1 / dmin;
	}
	return color;
}

float map(inout vec3 p) {
	p.xy *= rot(time * 0.5);
	p.yz *= rot(time * 0.4);
	p.zx *= rot(time * 0.3);
	return sdBox(p, vec3(1));
}

void main( void ) {
	vec3 rd = normalize(vec3(surfacePosition, 1));
	vec3 ro = vec3(0, 0, -3.5);
	vec3 color = vec3(0.3, 0.5, 0);
	float dist = 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			color = getColor(p);
			break;
		}
		dist += d;
		if (dist > 20.0) {
			break;
		}
	}

	gl_FragColor = vec4(color, 1);
}
