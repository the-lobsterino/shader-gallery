#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;//impscrub on pan/zoom
#define time fract(time*exp((dot(surfacePosition,surfacePosition))))

void main( void ) {

	float t = time;
	gl_FragColor = vec4( vec3( t ), 1.0 );

}