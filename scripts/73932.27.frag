#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 3.0;

	float color = 25.0;
	color += sin( position.x * cos( time / 01.50 ) * 0.10 ) + cos( position.y * cos( time / 1.0 ) * 1.0 );
	color += sin( position.y * sin( time / 01.00 ) * 0.10 ) + cos( position.x * sin( time / 1.0 ) * 1.0 );
	color += sin( position.x * sin( time / 00.50 ) * 0.10 ) + sin( position.y * sin( time / 1.0 ) * 1.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}