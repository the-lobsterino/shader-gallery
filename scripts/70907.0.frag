#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define EPS 0.001
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float map(vec3 p) {
	float r = 8.0;
	mat2 m = rot(time * 3.1);
	p.xy *= m;

	for (int i = 0; i < 13; i++) {
		p.yz *= m;
		p.zx *= m;
		p = abs(p) - r;
		r /= 2.0;
	}

	return sdBox(p, vec3(2));
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
	vec3 rd = normalize(vec3(surfacePosition, 1));
	vec3 ro = vec3(0, 0, -60);
	vec3 light = normalize(vec3(1, 1, -1));
	float dist = 0.0;
	float bright = 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			bright = max(dot(light, getNormal(p)), 0.1);
			break;
		}
		dist += d;
	}

	gl_FragColor = vec4(vec3(1,2,2) * bright, 1);
}
