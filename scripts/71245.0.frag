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

float map(inout vec3 p) {
	p.xy *= rot(time * 0.5);
	p.yz *= rot(time * 0.4);
	return sdBox(p, vec3(1));
}

void main( void ) {
	vec3 rd = normalize(vec3(surfacePosition, 1));
	vec3 ro = vec3(0, 0, -5);
	vec3 color = vec3(0.1);
	float dist = 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			color = p;
			break;
		}
		dist += d;
		if (dist > 30.0) {
			break;
		}
	}

	gl_FragColor = vec4(color, 1);
}
