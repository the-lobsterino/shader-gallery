#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x ) + mouse / 4.0;

	float color = 310.0;
	color += sin( position.x * cos( time / 1533333.0 ) * 8303.0 ) + cos( position.x * cos( time / 135.0 ) * 130.0 );
	color += sin( position.y * sin( time / 10343.0 ) * 430.0 ) + cos( position.y * sin( time / 235.0 ) * 430.0 );
	color += sin( position.x * sin( time / 5.3330 ) * 310.0 ) + sin( position.x * sin( time / 335.0 ) * 830.0 );
	color *= sin( time / 31.0 ) * 30.5;

	gl_FragColor = vec4( vec3( color, color * 30.5, sin( color + time / 33.0 ) * 30.75 ), 31.0 );

}