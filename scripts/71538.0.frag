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

float sdVerticalCapsule(vec3 p, float h, float r) {
	p.y -= clamp(p.y, 0., h);
	return length(p) - r;
}

float map(vec3 p) {
	p.y += 1.5;
	p.y += sin(time+p.z*0.1)*2.1;
	p.zx *= rot(p.z * sin(time * 0.5) * .005);	// bend

	p.x = abs(p.x);
	p -= vec3(2, -2, -time * 10.);

	float d =p.y+8.0;	// 1. / 0.;
	p.z = mod(p.z, 32.) - 16.;
	d = min(d, sdVerticalCapsule(p - vec3(2, -12.5, 0), 12., .4));
	p.z = mod(p.z, 2.) - 1.;
	d = min(d, sdBox(p - vec3(1.2, .2, 0), vec3(.1, .1, 4.)));
	d = min(d, sdBox(p, vec3(2, .1, .2)));
	return d;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 2));
	vec3 light = normalize(vec3(2, 1, -1));
	vec3 color = vec3(0);
	float dist = 0.;
	for (int i = 0; i < 120; i++) {
		vec3 p = rd * dist;
		float d = map(p);
		if (d < .01) {
			color = vec3(1, 1, 2) * 7.0 / float(i);
			break;
		}
		dist += d;
		if (dist > 100.) break;
	}
	gl_FragColor = vec4(color, 1);
}
