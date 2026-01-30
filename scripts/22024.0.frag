// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
// Altered
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 11
void main( void ) {
	vec2 pos = vec2(gl_FragCoord.x, gl_FragCoord.y);
	vec2 p = surfacePosition*8.0- vec2(10.0);
	vec2 i = p;
	float c = 1.0;
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++) 

}