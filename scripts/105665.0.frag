#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 v_texcoord;

void main( void ) {

	vec2 uv = -1. + 2. * v_texcoord;
	float c = step( distance( uv, vec2(0, 0) ), 0.5);

	gl_FragColor = vec4( c, c, c, 1.0 );

}