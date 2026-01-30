#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float r = (time / 100.0) * 1.0;
	float g = (time / 100.0) * 1.0;
	float b = (time / 100.0) * 1.0;
	
	gl_FragColor = vec4(r, g, b, 1.0);

}