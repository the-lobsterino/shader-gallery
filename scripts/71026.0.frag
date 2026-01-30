#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define EPS 0.001
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdLink(vec3 p, float le, float r1, float r2) {
	vec3 q = vec3(p.x, max(abs(p.y) - le, 0.0), p.z);
	return length(vec2(length(q.xy) - r1, q.z)) - r2;
}

float map(vec3 p) {
	p.xy *= rot(time * 0.7);
//	p.yz *= rot(radians(30.0));
	p.zx *= rot(time * 0.5);
	return sdLink(p, 2.0, 1.0, 0.5);
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
	vec3 rd = normalize(vec3((gl_FragCoord.xy - resolution * 0.5) / resolution.y, 1));
	vec3 ro = vec3(0, 0, -8);
	vec3 light = normalize(vec3(1, 2, -3));
	vec3 color = texture2D(backbuffer, gl_FragCoord.xy / resolution).rgb - 2.0 / 256.0;
	float dist = 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			color = vec3(1,1,2) * max(dot(light, getNormal(p)), 0.1);
			break;
		}
		dist += d;
		if (dist > 20.0) {
			break;
		}
	}

	gl_FragColor = vec4(color, 1);
}
