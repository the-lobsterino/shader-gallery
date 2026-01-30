#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define time fract(tan(time+(surfaceSize.x*surfaceSize.y)+dot(surfacePosition,surfacePosition)))

void main( void ) {
	
	// pan/zoom to see interesting interference patterns

	gl_FragColor = vec4( vec3( time ), 1.0 );

}