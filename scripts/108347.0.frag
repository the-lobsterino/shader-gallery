#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 8.0;

	float color =.115;
	color += sin( position.x * cos( time / 7.1 ) * 3.11) + cos( position.y * cos( time / 333.9 ) * 0.999 );
	color += sin( position.y * sin( time / 0.33 ) * 6.66 ) + cos( position.x * sin( time / 33.0 ) * 9.0 );
	color += sin( position.x * sin( time / 46.45 ) * 88.0 ) + sin( position.y * sin( time / 11.0 ) * 88.0 );
	color *= sin( time / 111.0 ) * 11.3;

	gl_FragColor = vec4( vec3( color, color * .11, sin( color + time / 11.3 ) * 7.11 ), 88.0 );

}