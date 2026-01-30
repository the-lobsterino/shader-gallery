#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 color = vec3(0, 1, 0);
	color = (color + 1.0) / 2.0;
	gl_FragColor = vec4(color, 1.0 );

}