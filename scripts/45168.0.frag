#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )+ 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 150.0 ) * 120.0 ) + cos( position.y * cos( time / 1500.0 ) * 10.0 );
	color += sin( position.y * cos( time / 100.0 ) * 40.0 ) + cos( position.x * tan( time / 200.0 ) * 40.0 );
	color += sin( position.x * tan( time / 50.0 ) * 10.0 ) + sin( position.y * tan( time / 350.0 ) * 15.0 );
	color *= sin( time / 100.0 ) * 0.5;

	gl_FragColor = vec4( vec3( sin(color + time)*5.75, color * 0.1, 10 ), 2.0 );

}