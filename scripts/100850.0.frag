#extension GL_OES_standard_derivatives : disable

precision highp float;

uniform float time; 
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 1.677778 ) * 80.0 ) + cos( position.y * cos( time / 10.0 ) * 90.708 );
	color += sin( position.y * sin( time / 10.0 ) * 4.0 ) + cos( position.x * sin( time / 2.9 ) * 1.0 );
	color += sin( position.x * sin( time / 9.0 ) * 1.0 ) + sin( position.y * sin( time / 1.5 ) * 55.0 );
	color *= sin( time / 9.8 ) * 5.5;

	gl_FragColor = vec4( vec3( color, color * 5.15, sin( color + time / 1.0 ) * 0.75 ), 1.0 );

}