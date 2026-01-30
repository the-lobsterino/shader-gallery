#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

bool hit(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * .5);

	const float b = .9;
	if (length(max(abs(p) - b, 0.)) > 0.) return false;
	p = p / (b * 2.) + .5;

	const vec2 m = vec2(1, 1);
	for (int i = 0; i < 2; i++) {
		p *= 3.;
		if (length(floor(p) - 1.) <= 1.) return false;
		p = fract(p);
	}
	return true;
}

#define ITER 100.

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = vec3(uv, 4);
	vec3 ro = vec3(0, 0, -6);
	bool prev = false;
	float pass = 0.;

	for (float i = 0.; i < ITER; i++) {
		bool h = hit(ro + rd * (1. + i / ITER));
		if (prev != h) {
			pass++;
			prev = h;
		}
	}
	gl_FragColor = vec4(vec3(1, 1, 2) * sqrt(pass) / 4., 1);
}
