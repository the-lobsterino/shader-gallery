#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
}
