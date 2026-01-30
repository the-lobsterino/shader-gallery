#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 100.0;

	float color = 0.0;
	color += sin( position.y + sin( time / 40.0 ) * 10.0 ) ;
	color += sin( position.x + sin( time / 30.0 ) * 10.0 ) ;
	

	gl_FragColor = vec4( vec3( color, color * 0.4, sin( color + time /3.0 ) * 0.55 )*0.5, 1.0 );

}