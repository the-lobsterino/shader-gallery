#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dCircle(vec2 p, float r) {
	return length(p) - r;
}

float opOr(float a, float b) {
	return min(a, b);
}

float opAnd(float a, float b) {
	return max(a, b);
}

float opXor(float a, float b) {
	return min(max(a, -b), max(b, -a));
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float a = dCircle(p - vec2(-0.3, 0.0), 0.5);
	float b = dCircle(p - vec2(0.3, 0.0), 0.5);
	float dist = opXor(a, b);
	gl_FragColor = vec4(vec3(sign(dist)), 1.0);

}