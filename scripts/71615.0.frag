#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

bool isExist(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * .5);
	if (length(max(abs(p) - vec3(.6), 0.)) > 0.) return false;
	if (mod(floor(length(p) * 15. - time), 2.) == 0.) return false;
	return true;
}

#define ITER 100.

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = vec3(uv, 2);
	vec3 ro = vec3(0, 0, -3);
	float bright;

	for (float i = 0.; i < ITER; i++) {
		vec3 p = ro + rd * (1. + i / ITER);
		if (isExist(p)) {
//			bright++;
			bright = 1. - i / ITER;
			break;
		}
	}
//	gl_FragColor = vec4(vec3(1, 1, 2) * .05 * bright, 1);
	gl_FragColor = vec4(vec3(1, 1, 2) * bright, 1);
}
