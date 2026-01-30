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

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

// unsigned rounded box: bs = box size, erad = edge radius
float udRoundBox( vec3 pos, vec3 bs, float erad )   
{ return length(max(abs(pos)-bs, 0.0))-erad; }


float map(vec3 p) {
	float r = 8.0;
//	float d = sdSphere(p, r);
	float d = udRoundBox(p, vec3(r*0.5), r*0.3);

	for (int i = 0; i < 3; i++) {
//		p.xy *= rot(time * 0.5);
		p.yz *= rot(time * 0.4);
		p.zx *= rot(time * 0.3);
		p = abs(p) - r;
		r /= 3.0;
//		d = min(d, sdSphere(p, r));
		d = min(d, udRoundBox(p, vec3(r*0.8), r*0.3));
	}
//	d = sdSphere(p, r);
	return d;
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
	vec3 ro = vec3(0, 0, -50);
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

	gl_FragColor = vec4(vec3(1.5+0.2*dist,2,1) * bright, 1);
}
