#ifdef GL_ES

precision mediump float;

#endif



#extension GL_OES_standard_derivatives : enable



uniform float time;

uniform vec2 mouse;

uniform vec2 resolution;



void main( void ) {



	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;



	float color = 0.0;

	color += position.x;



	gl_FragColor = vec4( 0.0, -1.0, color, 1.0 );



}