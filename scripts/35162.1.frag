#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
uniform vec2 surfaceSize;
void main( void ) {

	vec2 p = surfacePosition/surfaceSize;
	gl_FragColor = vec4( vec3( fract(exp(p.x + float(p.y<0.)/(-5.+time))) ), 1.0 );

}