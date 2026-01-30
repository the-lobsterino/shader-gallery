#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	gl_FragColor = 1.0-vec4(p+mouse/2.0, 0.5, 0.7);
}