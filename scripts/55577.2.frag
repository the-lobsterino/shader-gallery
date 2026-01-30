#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define time fract(dot(surfaceSize,surfaceSize)*(gl_FragCoord.x*gl_FragCoord.x+gl_FragCoord.y*gl_FragCoord.y))

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - (mouse * 2.0 - 1.0);
	float t = fract(fract(time*dot(surfacePosition,surfacePosition)+time)*2.0-1.0);
	gl_FragColor = vec4( vec3( fract(position+time+t), fract(time)), 1.0 );

}