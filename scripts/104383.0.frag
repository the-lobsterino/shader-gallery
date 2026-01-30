#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color = 0.;
	
	color = sin(0.5 * 3.14* time);

	gl_FragColor = vec4( vec3( 0.1*color, 0.5 * 0.5, sin( 0.4 + time / 3.0 ) * 0.75 ), 1.0 );

}