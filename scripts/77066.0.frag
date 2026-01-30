#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.9;
	color += sin( position.x * cos( time / 18.0 ) * 81.0 ) + cos( position.y * cos( time / 18.0 ) * 9.0 );
	color += sin( position.y * sin( time / 9.0 ) * 36.0 ) + cos( position.x * sin( time / 27.0 ) * 36.0 );
	color += sin( position.x * sin( time / 6.0 ) * 9.0 ) + sin( position.y * sin( time / 36.0 ) * 81.0 );
	color *= sin( time / 9.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.6 ) * 0.9 ), 1.8 );

}