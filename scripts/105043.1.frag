#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += abs( position.x * cos( time / 15.0 ) * 80.0 ) + abs( position.y * cos( time / 15.0 ) * 10.0 );
	color += floor( position.y * floor( time / 10.0 ) * 40.0 ) + cos( position.x * floor( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + ceil( position.y * ceil( time / 35.0 ) * 80.0 );
	color *= cos( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, floor( color + time / 3.0 ) * 0.75 ), 1.0 );

}