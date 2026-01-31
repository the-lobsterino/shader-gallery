#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec4 frag_color = vec4(0.0, 0.0, 0.0, 1.0);
	
	gl_fragColor = frag_color;
}