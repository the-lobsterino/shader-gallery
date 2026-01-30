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
vec2 p =   (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*6.;
	float d = 0.5;

	for (int i = 0; i < 4; i++) {
		d = min(d, map(p, 1.0));
		p *= rot(time / 4.0);
		p = abs(p) * 2.5 - 5.0;
	}

	d = min(d, map(p, 4.0));

	gl_FragColor = vec4(d * -4.0, d * d, d, 1);
}
