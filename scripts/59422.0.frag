#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	mat2 a = mat2(1., 2.,  3., 4.);
	mat2 b = mat2(10., 20.,  30., 40.);
	mat2 c = a * b;

	float color = 0.0;

	gl_FragColor = vec4( vec3( c[0][0] ), 1.0 );

}