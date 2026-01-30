#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float map(vec2 p, float r) {
	return length(p) - r;
}

void main( void ) {
	vec2 p = surfacePosition * 2.0;

	for (int i = 0; i < 2; i++) {
		p *= rot(time / 2.0);
		p = abs(p) * 4.0 - 2.0;
	}

	float d = map(p, 1.0);

	gl_FragColor = vec4(0, -d, d, 1);
}
