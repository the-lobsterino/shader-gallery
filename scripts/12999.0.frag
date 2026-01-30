#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 1.0;

	float color = 0.0;
	
	color += sin( position.x * 400.0 );
	color += tan( position.y * (time*0.2) * 30.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + sin( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, color * 0.75 ), 1.0 );

}