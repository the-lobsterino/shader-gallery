#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;


	float color = (position - mouse).x == 0.0 ? 1.0 : 0.0;
	gl_FragColor = vec4( color, color, color, 1.0 );

}