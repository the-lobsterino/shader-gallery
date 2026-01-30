#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float rand(vec2 co) {
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.)) - r;
}

float map(vec3 p) {
	const float c = 3.;
	const float r = .05;
	float d = 1. / 0.;
	for (float z = -c; z <= c; z++) {
		for (float x = -c; x <= c; x++) {
//			float y = c + .5 - max(abs(z), abs(x));
			float y = rand(vec2(z, x)) * c;
			vec3 b = vec3(.5 - r, y, .5 - r);
			d = min(d, sdRoundBox(p - vec3(x, 0, z), b, r));
		}
	}
	return d;
}

vec3 getNormal(vec3 p) {
	const vec2 eps = vec2(0, .01);
	float d = map(p);
	return normalize(vec3(
		map(p + eps.tss) - d,
		map(p + eps.sts) - d,
		map(p + eps.sst) - d));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 3));
	vec3 ro = vec3(0, 0, -15);
	mat2 rot_yz = rot(radians(20.));
	mat2 rot_zx = rot(time * .5);
	float dist = 0.;
	float bright = 0.;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		p.yz *= rot_yz;
		p.zx *= rot_zx;
		float d = map(p);
		if (d < .01) {
			vec3 n = getNormal(p);
			bright = 1. - length(step(.9, abs(n))) * .7;
			break;
		}
		dist += d;
		if (dist > 30.) break;
	}
	gl_FragColor = vec4(vec3(1, 1, 2) * bright, 1);
}
