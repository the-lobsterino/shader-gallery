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

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

float sdWave(vec3 p) {
	const float wlen = 5.;
	float d = length(p) * wlen - time;
	float a = mod(d, 2.) - 1.;
	float b = 1. - mod(d + 1., 2.);
	return (abs(a) < abs(b) ? a : b) / wlen;
}

float map(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * .5);
	float db = sdBox(p - vec3(.5, 0, 0), vec3(.5, 1, 1));
//	float ds = sdSphere(p, 1.2);
	float dw = sdWave(p);
	return max(db, dw);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 2));
	vec3 ro = vec3(0, 0, -4);
	float dist = 0.;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < .01) {
			break;
		}
		dist += d;
		if (dist > 10.) break;
	}
	gl_FragColor = vec4(vec3(1, 1, 2) * ((6. - dist) / 3.), 1);
}
