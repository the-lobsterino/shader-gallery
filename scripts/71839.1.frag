#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

bool hit(vec3 p) {
	p.yz *= rot(time / 3.0);	
	p.zx *= rot(time);
	if (length(max(abs(p) - vec3(.6), 0.)) > 0.) return false;
	//if (length(p) < .4) return false;
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
		if (hit(p)) {
			bright++;
		}
	}
	gl_FragColor = vec4(vec3(1, 1, 2) * .01 * bright, 1);
}
