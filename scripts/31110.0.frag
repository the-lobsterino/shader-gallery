#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
const float cellsize = 16.;
void main( void ) {
	gl_FragColor = vec4(1);
	vec2 p = (surfacePosition)*cellsize;
	vec2 c = fract(p+time);
	vec2 C = p - c;
	gl_FragColor *= 1./(1.+length(C));
}