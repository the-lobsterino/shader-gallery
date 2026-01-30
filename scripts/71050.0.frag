#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec2 p, vec2 b) {
	vec2 q = abs(p) - b;
	return length(max(q, 0.0));
}

float sdSphere(vec2 p, float r) {
	return length(p) - r;
}

float map(vec2 p) {
	float d;
	p *= rot(time * 0.5);
	d = sdSphere(p + vec2(0, 0.5), 0.1);

	p += vec2(0.5, 0);
	p *= rot(time * 2.0);
	d = min(d, sdBox(p, vec2(0.05, 0.2)));

	return d;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	float d = map(p);
	float bright = (d <= 0.0) ? 1.0 : 0.0001 / (d * d);
	gl_FragColor = vec4(vec3(bright), 1);
}
