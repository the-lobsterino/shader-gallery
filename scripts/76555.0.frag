#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 3.0 ) * 90.0 ) + cos( position.y * cos( time / 1.0 ) * 10.0 );
	color += sin( position.y * sin( time / 9.0 ) * 20.0 ) + cos( position.x * sin( time / 2.0 ) * 40.0 );
	color += sin( position.x * sin( time / 3.0 ) * 90.0 ) + sin( position.y * sin( time / 3.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 3.0, sin( color + time / 35.0 ) * 1.75 ), 3.0 );

}