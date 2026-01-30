#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
#define MAX_ITER 256

// Z = Z² + C

void main() {
	vec2 C = (mouse-.5)/5.;
	vec2 Z = surfacePosition;
	Z += vec2(cos(time), sin(time))*surfaceSize/resolution;
	gl_FragColor = vec4(1);
	for(float i = 0.; i <= float(MAX_ITER); i+=1.){
		if(length(Z) > 1.){
			gl_FragColor = vec4(i/float(MAX_ITER));
			return;
		}
		Z = vec2(Z.x-Z.y, 2.*Z.x*Z.y)+C;
	}
	//gl_FragColor = vec4(i/float(MAX_ITER));
}