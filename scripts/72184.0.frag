#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 col = vec4(261, 0.1, 561, 5.1);
	col = col / 1.0;

	gl_FragColor = col;

}