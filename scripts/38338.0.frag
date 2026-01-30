#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

uniform vec2 mouse;
uniform vec2 resolution;


vec2 cmult(vec2 z1, vec2 z2) {
	return vec2(z1.x*z2.x - z1.y*z2.y, z1.x*z2.y + z1.y*z2.x);
}

float smoothIter(vec2 z, int iter) {
	return float(iter + 1) - log(log(length(z)))/log(2.0);
}

const int maxIter = 100;
vec3 mandelbrot(vec2 z0, vec2 c) {
	vec2 z = z0;
	int iter;
	for(int i = 0; i < maxIter; i++) {
		z = cmult(z, z) + c;
		if(length(z) > 2.0) {
			iter = i;
			break;
		}
	}
	return 3.0*vec3(smoothIter(z, iter)/float(maxIter));
}

void main(void) {
	vec2 uv = 1.5*(2.0*gl_FragCoord.xy - resolution)/resolution;
	gl_FragColor = vec4(mandelbrot(uv, vec2(1.0*cos(time), 1.0*sin(time))), 1.0);
}