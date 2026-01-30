#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define INF (1.0/0.0)
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec2 p, vec2 b) {
	vec2 q = abs(p) - b;
	return length(max(q, 0.0));
}

float sdSphere(vec2 p, float r) {
	return length(p) - r;
}

float map() {
	vec3 p = vec3(surfacePosition, 0);
	p *= 20.0;
	p.xy *= rot(time * 0.5);
	p.yz *= 1.0 / rot(time * 0.4);
	p -= vec3(-10, 2.5, 0);

	int pat[5];	// pattern
	pat[0] = 0x73571;
	pat[1] = 0x44521;
	pat[2] = 0x75721;
	pat[3] = 0x45525;
	pat[4] = 0x43572;

	float d = INF;
	for (int j = 0; j < 5; j++) {
		int mask = 0x80000;
		for (int i = 0; i < 20; i++) {
			if (mod(float(pat[j] / mask), 2.0) > 0.0) {
				vec2 q = p.xy - vec2(i, -j);
				d = min(d, sdBox(q, vec2(0.3)));
//				d = min(d, sdSphere(q, 0.3));
			}
			mask /= 2;
		}
	}
	return d;
}

void main( void ) {
	float d = map();
	vec3 color = vec3(1,2,1) * 0.02 / max(d, 0.0);
	gl_FragColor = vec4(color, 1);
}
