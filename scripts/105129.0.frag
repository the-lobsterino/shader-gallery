// normal then negative and repeat
// the long you watch the more it gets weirder.

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.5;
 
	// lines and wavy parts
	float color = 1.5;
	color += abs( position.x * cos( time / 15.1 ) * 80.1 ) + cos( position.y * cos( time / 15.5 ) * 10.1 );
	color += floor( position.y * sin( time / 15.7 ) * 40.5 ) + cos( position.x * sin( time / 25.1 ) * 40.5 );
	color += abs( position.x * sin( time / 5.1 ) * 10.1 ) + sin( position.y * sin( time / 35.7 ) * 80.1 );
	color *= sin( time / 10.5 ) * 1.5;

	// normal and negative colors also weird
	gl_FragColor = vec4( vec3( color, color * 1.5, sin( color + time / 3.5 ) * 3.75 ), 13 );

}