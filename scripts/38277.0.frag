#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 1.0 - gl_FragCoord.xy / resolution.xy * 2.0;
	gl_FragColor.g = pow(position.x, 2.0); 

}