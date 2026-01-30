#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x, float coef) {
	return coef * x * (1. - x);	
}

void main( void ) {
	
	const int ITERS = 1000;
	float coef = (gl_FragCoord.y / resolution.y);
	float x = coef;
	int lastI = int(gl_FragCoord.x / resolution.x * float(ITERS));
	
	for(int i = 0; i < ITERS; ++i) {
		
		x = f(x, 4.0);
		if(i > lastI) break;
	}
	
	
	gl_FragColor.r = x;
}