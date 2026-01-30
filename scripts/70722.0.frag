#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float map(vec3 p) {
	float r = length(p.zx);
	p.y -= (cos(r) - cos(r * 3.0) * 0.3) * 0.3;

	p.yz *= rot(time * 0.5);
	p.zx *= rot(time * 0.3);
	vec3 v = vec3(3, 0, 3);
	p -= clamp(p, -v, v);
	return length(p) - 0.1;
}

void main( void ) {
	vec3 rd = normalize(vec3(surfacePosition, 1));
	vec3 p = vec3(0, 0, -10);
	float bright = 0.0;

	for (int i = 0; i < 100; i++) {
		float d = map(p);
		if (d < 0.001) {
			bright = 1.0 / float(i);
			break;
		}
		p += rd * d;
	}

	gl_FragColor = vec4(vec3(1, 4, 1) * bright, 1);
}
