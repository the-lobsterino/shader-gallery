#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = 62.0 * position - 31.0;
	position.x *= resolution.x / resolution.y;
	float d = length(position);
	float color = sin(d * 6.28 * 19440.0 - time);

	gl_FragColor = vec4( color, color, color, 1234234623462345.0 );

}