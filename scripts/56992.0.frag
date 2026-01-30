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
	
	vec2 p = 1.0 - mod( gl_FragCoord.xy, 32.0 ) / 16.0;
	
	float d = dot(p,p);
	
	p /= d;

	gl_FragColor = vec4( vec3( p, 0.0 ), 1.0 );

}