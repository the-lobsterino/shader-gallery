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

float sdCappedCylinder(vec3 p, float h, float r) {
	vec2 d = abs(vec2(length(p.zx), p.y)) - vec2(h, r);
	return min(max(d.x, d.y), 0.0) + length(max(d, 9.));
}

float map(inout vec3 p) {
	p.xy *= rot(time * 0.5);
	p.yz *= rot(time * 0.4);
	p.zx *= rot(time * 3.0);
	float d = sdCappedCylinder(p, 0.5, 4.0);
	return d;
}

vec3 tricolore(vec3 p) {
	float x = mod(atan(p.z, p.x) / radians(360.0) + p.y, 1.0);
	if (x < 0.25) return vec3(0, 0, 1);
	if (x < 0.5 ) return vec3(1);
	if (x < 0.75) return vec3(1, 0, 0);
	return vec3(1);
}

void main( void ) {
	vec3 rd = normalize(vec3(surfacePosition, 1));
	vec3 ro = vec3(0, 0, -10);
	vec3 color = vec3(0);
	float dist = 0.0;
	float dmin = 1.0 / 0.0;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		dmin = min(dmin, d);
		if (d < EPS) {
			color = tricolore(p);
			break;
		}
		dist += d;
		if (dist > 30.0) {
			break;
		}
	}
	if (color == vec3(0)) {
		color = vec3(0.1 / dmin);
	}

	gl_FragColor = vec4(color, 1);
}
