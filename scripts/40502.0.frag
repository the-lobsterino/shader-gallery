#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 original;
vec3 target;
vec3 result;

void main( void ) {

	original =
	target =
	result = vec3(0.0,0.0,0.0);
	gl_FragColor = vec4( result, 1.0 );

}