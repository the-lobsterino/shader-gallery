#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = (1.0 / mod(gl_FragCoord.x,100.0)) + (1.0 / mod(-gl_FragCoord.x,100.0)) + (1.0 / mod(gl_FragCoord.y,100.0)) + (1.0 / mod(-gl_FragCoord.y,100.0));
	color /= 2.0;

	gl_FragColor = vec4( color, color, color, 1.0 );

}