//Modified by Jiao tangsheng on February 1, 2021
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
	//p.yz *= rot(radians(30.0));
	p.xy *= rot(time * 0.2);
	p.yz *= rot(time * 0.5);	
	p.zx *= rot(time * 0.3);	
	float db = sdBox(p, vec3(1));
	float ds = sdSphere(p, 1.24121356237);
	//return min(db, ds);
	return max(db, -ds);
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
	vec2 pos =   (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*3.;
	vec3 ro = vec3(pos, -5);
	vec3 rd = vec3(0, 0, 1);	
	//vec3 ro = (vec3(surfacePosition*5., -5));
	//vec3 rd = vec3(0, 0, 1);
	vec3 light = normalize(vec3(1, 2, -3));
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
		if (dist > 10.0) {
			break;
		}
	}

	gl_FragColor = vec4(vec3(2,1,1) * bright, 1);
}
