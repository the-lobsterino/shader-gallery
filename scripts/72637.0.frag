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
	
	vec2 U = floor( (gl_FragCoord.xy - resolution/2.0) * surfacePosition );
	
	float a = U.x; float b = U.y;
	
	gl_FragColor = vec4( vec3( ( tan( a / b - b / a) ) * 0.5 + 0.5 ), 1.0 );

}