#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define N_ITER 100

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 cmult(vec2 a, vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main( void ) {

	vec2 position = ((gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y) * 2.5 * log2(mix(1.001, 2.0, mouse.x)) + mix(vec2(-1.786, 0.0), vec2(-.5, 0.0), mouse.x);
	
	vec2 z = vec2(0);
	int ctr = 0;
	for (int i = 0; i < N_ITER; i++) {
		z = cmult(z, z) + position;
		if (length(z) >= 2.0) {
			break;
		}
		ctr++;
	}
	if (ctr == N_ITER) {
		discard;
	}

	gl_FragColor = vec4(vec3(1.0 - float(ctr) / float(N_ITER)), 1.0);

}