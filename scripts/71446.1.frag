#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.));
}

vec2 pmod(vec2 p, float r) {
	float n = radians(360.) / r;
	float a = atan(p.x, p.y) + n * .5;
	a = floor(a / n) * n;
	return p * rot(a);
}

float map(vec3 p) {
	p.zx *= rot(time * .5);
	p.xy = pmod(p.xy, 7.);
	p.y -= 4.;
	return sdBox(p, vec3(1));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 2));
	vec3 ro = vec3(0, 0, -12);
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
		if (dist > 20.) {
			break;
		}
	}

	gl_FragColor = vec4(color, 1);
}
