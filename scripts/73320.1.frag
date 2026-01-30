#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	float t = abs(cos(
		time+surfaceSize.x*surfaceSize.y+
		dot(surfacePosition,surfacePosition)+
		resolution.x*resolution.y/2.0-gl_FragCoord.y*resolution.x+gl_FragCoord.x));
	
	gl_FragColor = vec4( vec3( t*t*t ), 1.0 );

}