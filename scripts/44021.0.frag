#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float f (vec2 p) {
	return fract( dot(p,p) / 256.0);
	float r = length(p);
	float a = atan(p.y, p.x);
	return r - 0.6 + 0.5 * sin(2.0 * a + 10.0 * r * r * r * r * r);
}

vec2 grad (vec2 p) {
	vec2 h = vec2(1.7, 0.5);
	return vec2(f(p + h.xy) - f(p - h.xy), f(p + h.yx) - f(p - h.yx)) / 2.0 * h.x;
}

float color (vec2 p) {
	float v = f(p);
	vec2 g = grad(p);
	return smoothstep(0.0, 0.5, abs(v) / length(g));
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y) * 2.0;
	p = -2.0*surfacePosition;
	float t = 4.0;
	p *= mat2(cos(t), sin(t), -sin(t), cos(t));
	vec3 v = vec3(1.0 - color(p));
	gl_FragColor = vec4(vec3(v.x * gl_FragCoord.x, 0.2 * v.y * gl_FragCoord.y, 1.0), 1.0);

}