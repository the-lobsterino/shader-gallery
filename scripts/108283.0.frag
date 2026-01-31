#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / sin(cos(mouse));

	float color = 10.0;
	color += sin( position.x * cos( time / 3.0 ) * 80.0 ) + cos( position.y * cos( time / 0.5 ) * 0.1 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 0.5 ) * -100000000.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 0.5 ) * 10000000.0 );
	color *= sin( time / 1.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}