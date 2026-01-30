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

vec2 pmod(vec2 p, float r, out float a) {
	float n = radians(360.) / r;
	a = atan(p.x, p.y);
	a = floor(a / n + .5) * n;
	return p * rot(a);
}

float domino(vec3 p, float r, float phase, float t) {
	float b = radians(360.) * phase / r;
	p.xz *= rot(b);

	float a;
	p.xz = pmod(p.xz, r, a);
	p.z -= 50.;

	a = mod(a + b + t, radians(360.)) - radians(180.);
	p.xy *= rot(-clamp(a * 6., 0., radians(70.)));
	return sdBox(p, vec3(.9, 5, 2.5));
}

float map(vec3 p) {
	p.yz *= rot(radians(30.));
	float t = time * .5;
	p -= vec3(sin(-t), 0, cos(-t)) * 50.;

	const float r = 24.;
	float d = 1. / 0.;
	d = min(d, domino(p, r, .0, t));
	d = min(d, domino(p, r, .5, t));
	return d;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 5));
	vec3 ro = vec3(0, 0, -100);
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
		if (dist > 200.) break;
	}
	gl_FragColor = vec4(color, 1);
}
