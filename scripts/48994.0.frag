#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 A = gl_FragCoord.xy/resolution-0.5;
	vec2 B = surfacePosition/surfaceSize-0.5;
	A -= mouse * 2.0 - 1.0;
	float v = 1.0-fract(dot(A,B));
	v = 1.0 - (v * 0.5 + 0.5);
	gl_FragColor = vec4( vec3(v), 1.0 );

}