// dither pattern example

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4( vec3( fract(position.x * 200.0 * sqrt(2.0)) + fract(position.y * 200.0 * sqrt(2.0)) + fract((position.x + position.y) * 200.0) + fract((position.x - position.y) * 200.0) ) / 4.0, 1.0 );
}