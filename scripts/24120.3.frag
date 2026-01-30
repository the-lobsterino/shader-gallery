#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 3.0;
	color+= sin( position.x * cos( time / 2.0 ) * 80.0 ) + cos( position.y * cos( time / 3.0 ) * 100.0 );
	color*= sin( time / 5.0 ) * 1.0;

	gl_FragColor = vec4( vec3( color, color * 1.0,  sin( color + time / 8.0 ) * 0.75 ), 1.0 );

}