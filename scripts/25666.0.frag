#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 mouse1	= vec2(0.1, 0.5);
	//vec2 resolution	= vec2(10000, 10000);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse1 / 2.0;
	float color = .01;
	color += sin( position.x * cos( time / 2.0 ) * 9.0 ) + cos( position.y * cos( time / 3.0 ) * 5.0 );
	color += sin( position.y * sin( time /3.0 ) * 55.0 ) + cos( position.x * sin( time / 2.0 ) * 70.0 );
	color += sin( position.x * sin( time / 8.0 ) * 1.0 ) + sin( position.y * sin( time / 3.0 ) * 5.0 );
	color *= sin( time / 5.0 ) * 0.25;

	gl_FragColor = vec4( vec3( color, color * 0.25, sin( color + time / .8 ) * 0.75 ), 1.0 );

}