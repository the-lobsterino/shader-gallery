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
	
	vec2 sp = surfacePosition;
	float dp = dot(sp,sp);
	float fdp = fract(dp);
	
	gl_FragColor = vec4( vec3( fdp ), 1.0 );

}