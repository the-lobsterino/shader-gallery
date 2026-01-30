#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 100.0 ) * 800.0 ) + cos( position.y * cos( time / 150.0 ) * 100.0 );
	color += sin( position.y * sin( time / 100.0 ) * 400.0 ) + cos( position.x * sin( time / 250.0 ) * 400.0 );
	color += sin( position.x * sin( time / 50.0 ) * 100.0 ) + sin( position.y * sin( time / 350.0 ) * 800.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}