#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
#define wave(a,b,c,d) (pow(.5+.5*sin(distance(a,b)*(d)-time*(c)),2.))

#define GOLDEN_ANGLE_RADIAN 2.39996

varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition;

	float w = 0.0;
	float sw = 0.0;
	float iter = 0.0;
	float ww = 1.0;
	// it seems its absolutely fastest way for water height function that looks real
	for(int i=0;i<64;i++){
		w += ww * wave(position, vec2(sin(iter), cos(iter)), 3.0, 20.0 + iter * 7.0);
		sw += ww;
		ww *= 0.9;
		ww = max(ww, 0.05);
		iter += GOLDEN_ANGLE_RADIAN;
	}
	
	w /= sw;
	

	
	gl_FragColor = vec4( pow(w, 1.) );

}