#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 mouse = vec2(sin(0.1*time),cos(0.1*time));
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse*2.0;

	float color = 0.5;
	color += sin( position.x * cos( time / 15.0 ) * 0.1 ) + cos( position.y * cos( time / 15.0 ) * 25.2 );
	color += sin( position.y * sin( time / 10.0 ) * 10.0 ) + tan( position.x * sin( time / 25.0 ) * 5.1 );
	color += sin( position.x * sin( time / 5.0 ) * 5.0 ) + sin( position.y * sin( time / 35.0 ) * 49.1 );
	color *= sin( time / 15.0 ) * 10.0;

	gl_FragColor = vec4( 10.0 * sin(color), 2.0 * cos(color), 1000.0 * tan(color), 1.0 );

}