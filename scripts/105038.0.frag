#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 7.5;
	color += sin( position.x * cos( time / 15.1 ) * 80.5 ) + cos( position.y * cos( time / 15.7 ) * 10.1 );
	color += abs( position.y * sin( time / 10.5 ) * 40.1 ) + cos( position.x * sin( time / 25.5 ) * 40.0 );
	color += floor( position.x * sin( time / 5.1 ) * 10.5 ) + sin( position.y * sin( time / 35.1 ) * 80.1 );
	color *= ceil( time / 10.5 ) * 5.5;

	gl_FragColor = vec4( vec3( color, color * 7.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}