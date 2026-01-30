#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float r = time * (180.0 / 3.14);
	gl_FragColor = vec4(r, 5.0, 0.7, 4.7);
}