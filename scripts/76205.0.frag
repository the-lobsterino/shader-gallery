#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 40.0 ) * 80.0 ) + cos( position.y * cos( time / 14.0 ) * 3.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 4.0 ) * 400.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 880.0 );
	color *= sin( time / 30.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 100.0, sin( color + time / 3.0 ) * 5.75 ), 1.0 );

}