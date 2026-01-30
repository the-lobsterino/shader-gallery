#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 1.0;

	float color = 3.1;
	color += sin( position.x * cos( time / 56.0 ) * 8.0 ) + cos( position.y * cos( time / 4.0 ) * 31.0 );
	color += sin( position.y * sin( time / 1.0 ) * 41.0 ) + cos( position.x * sin( time / 4.0 ) * 100.0 );
	color += sin( position.x * sin( time / 5.0 ) * 1.0 ) + sin( position.y * sin( time / 3.0 ) * 98.0 );
	color *= sin( time / 30.0 ) * 1.5;

	gl_FragColor = vec4( vec3( color, color * .0, sin( color + time / 1.0 ) * 5.75 ), 9.0 );

}