#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float sdLink(vec3 p, float le, float r1, float r2) {
	vec3 q = vec3(p.x, max(abs(p.y) - le, 0.), p.z);
	return length(vec2(length(q.xy) - r1, q.z)) - r2;
}

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

float map(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * .5);
	p.xy *= rot(time * .6);
	float d = 1. / 0.;
	d = min(d, sdSphere(p - vec3(2, 0, 0), 1.));
	d = min(d, sdBox(p - vec3(-2, 0, 0), vec3(1)));
	d = min(d, sdLink(p - vec3(0, 0, 2), .5, 1., .5));
	return d;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) /min(resolution.x, resolution.y)*4.;
	vec3 ro = vec3(uv, 8);
	vec3 rd = vec3(0, 0, -1);
	vec3 color = vec3(0);
	float dist = 0.;
	for (int i = 1; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.01) {
			color = vec3(1, 1, 2) * 3. / float(i);
			break;
		}
		dist += d;
		if (dist > 20.) break;
	}
	gl_FragColor = vec4(color, 1);
}
