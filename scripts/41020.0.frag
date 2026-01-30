#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265359;

float point(vec2 src, vec2 target) {
	return pow(0.001 / distance(target, src), 1.);
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
	if(t2.x == t1.x) {
		if(src.y >= t1.y)
			return point(src, t1);
		if(src.y <= t2.y)
			return point(src, t2);
		return point(src, vec2(t1.x, src.y));
	}
	float k = (t2.y - t1.y) / (t2.x - t1.x), b = t1.y - k * t1.x;
	float norm_k = -1. / k;
	float b1 = t1.y - norm_k * t1.x;
	float b2 = t2.y - norm_k * t2.x;
	float base = src.x * norm_k;
	if(src.y == base + b1)
		return point(src, t1);
	if(src.y < base + b2)
		return point(src, t2);
	float src_b = src.y - base;
	float ix = (src_b - b) / (k - norm_k);
	float iy = norm_k * ix + src_b;
	return point(src, vec2(ix, iy));
}

vec2 res() {
	float min = min(resolution.x, resolution.y);
	return vec2(resolution.x / min, resolution.y / min);
}

vec2 to_local(vec2 a) {
	return a * res() * 2. / resolution;
}

vec2 to_2d(vec3 a) {
	float H_FOV = -70., F = res().x / 2. / tan(radians(H_FOV / 2.));
	return vec2(F * a.x / (a.z + F), F * a.y / (a.z + F));
}

float side(vec2 src, vec3 center, float size, float y, float angle) {
	return segment(src, to_2d(center + vec3(cos(angle) * size,  y, sin(angle) * size)), to_2d(center + vec3(cos(angle + PI / 2.) * size, y, sin(angle + PI / 2.) * size)));
}

float sidev(vec2 src, vec3 center, float size, float y, float angle) {
	return segment(src, to_2d(center + vec3(cos(angle) * size, y, sin(angle) * size)), to_2d(center + vec3(cos(angle) * size, -y, sin(angle) * size)));
}

float cube(vec2 src, vec3 center, float size) {
	float color = 0., h = size / 2., diagonal = length(vec2(h, h)), angle = time;

	color += side(src, center, diagonal, h, angle);
	color += side(src, center, diagonal, h, angle + PI / 2.);
	color += side(src, center, diagonal, h, angle + PI);
	color += side(src, center, diagonal, h, angle + PI * 3. / 2.);

	color += side(src, center, diagonal, -h, angle);
	color += side(src, center, diagonal, -h, angle + PI / 2.);
	color += side(src, center, diagonal, -h, angle + PI);
	color += side(src, center, diagonal, -h, angle + PI * 3. / 2.);

	color += sidev(src, center, diagonal, h, angle);
	color += sidev(src, center, diagonal, h, angle + PI / 2.);
	color += sidev(src, center, diagonal, h, angle + PI);
	color += sidev(src, center, diagonal, h, angle + PI * 3. / 2.);

	return color;
}

void main(void) {
	vec2 coord = to_local(gl_FragCoord.xy - resolution / 2.);
	gl_FragColor = vec4(vec3(cube(coord, vec3(0., sin(time) * 0.7, 0.5), 0.5)), 1.);
}