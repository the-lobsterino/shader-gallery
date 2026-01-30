#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float m = position.x;
	gl_FragColor = vec4( m, m, m, 0.5 );

}