#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse + 4.0;

	float color = 0.0;
	color += sin( position.x * tan( time / 15.0 ) * 8000.0 ) + cos( position.y * cos( time / 55.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 8.0 ) + tan( position.x * sin( time / 25.0 ) * 89.0 );
	color += sin( position.x * sin( time / 5.0 ) * -8.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time /20.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.05, sin( color / time / 5.0 ) * 0.33 ), 3.0 );

}