#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.x / resolution.xy ) + 4.0;

	float color = 0.5;
	color += sin( position.x * sin( 5.0 ));	
	color += cos( position.y * cos( 5.0 ) * 2.0 );
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time ) * 0.5 ), 2.0 );

}