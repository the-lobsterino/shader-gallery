#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float point(vec2 src, vec2 target) {
	return pow(1. / length(target - src), 1.);
}

float segment(vec2 src, vec2 t1, vec2 t2) {
	if(t2.y == t1.y) {
		if(t1.x > t2.x) {
			vec2 tmp = t1;
			t1 = t2;
			t2 = tmp;
		}
		if(src.x <= t1.x)
			return point(src, t1);
		if(src.x >= t2.x)
			return point(src, t2);
		return point(src, vec2(src.x, t1.y));
	}
	if(t2.y > t1.y) {
		vec2 tmp = t1;
		t1 = t2;
		t2 = tmp;
	}
	float k = (t2.y - t1.y) / (t2.x - t1.x), b = t1.y - k * t1.x;
	float norm_k = -1. / k;
	float b1 = t1.y - norm_k * t1.x;
	float b2 = t2.y - norm_k * t2.x;
	float base = src.x * norm_k;
	if(src.y >= base + b1)
		return point(src, t1);
	if(src.y <= base + b2)
		return point(src, t2);
	float src_b = src.y - base;
	float ix = (src_b - b) / (k - norm_k);
	float iy = norm_k * ix + src_b;
	return point(src, vec2(ix, iy));
}

vec2 to_world(vec2 a) {
	return a * resolution / 2.;
}

void main(void) {
	float PI = 3.14159265359;
	
	vec2 coord = gl_FragCoord.xy - resolution / 2.;
	gl_FragColor = vec4(vec3(segment(coord, to_world(vec2(-0.5, sin(time) * 0.6)), to_world(vec2(0.5, sin(time + PI) * 0.6)))), 1.);
}