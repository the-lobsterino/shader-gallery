#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 5.0 ) * 380.0 ) + cos( position.y * cos( time / 15.0 ) * 150.0 );
	color += sin( position.y * sin( time / 150.0 ) * 45011.0 ) + cos( position.x * sin( time / 255.0 ) * 2450.0 );
	color += sin( position.x * sin( time / 111.0 ) * 111150.0 ) + sin( position.y * sin( time / 15115.0 ) * 1580.0 );
	color *= sin( time / 140.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 666.0, sin( color + time / 54120369.0 ) * 150.75 ), 1.0 );

}