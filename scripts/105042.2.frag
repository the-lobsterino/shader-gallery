#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.5;

	float color = 3.5;
	color += cos( position.x * cos( time / 15.1 ) * 80.1 ) + cos( position.y * cos( time / 15.3 ) * 10.5 );
	color += abs( position.y * sin( time / 10.7 ) * 40.5 ) + cos( position.x * sin( time / 25.5 ) * 40.3 );
	color += floor( position.x * sin( time / 5.1 ) * 10.7 ) + sin( position.y * sin( time / 35.3 ) * 80.5 );
	color *= ceil( time / 10.5 ) * 5.5;

	gl_FragColor = vec4( vec3( color, color * 8.5, sin( color + time / 3.3 ) * 5.75 ), 1.1 );

}