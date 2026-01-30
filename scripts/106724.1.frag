#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	
	float color = 0.0;
	color = time / 0.1;
	

	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}