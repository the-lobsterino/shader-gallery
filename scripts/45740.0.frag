#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926535;

void main( void ) {
	
	float var = 0.0;
	var = sin( 2.0 * pi * mouse.x * 10.0 * gl_FragCoord.x / resolution.x );
	var *= 0.8;
	var = ( var + 1.0 ) * 0.5;
	var *= resolution.y;
	
	float weight = 0.01 * resolution.y;

	vec3 col = vec3( 1.0 );
	
	if ( abs( gl_FragCoord.y - var ) <= weight * 0.5 ) {
		col = vec3( 0.0 );
	}
	
	gl_FragColor = vec4( col, 1.0 );

}