#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin(( position.x + position.y + time) * 2.0 ) * 0.4 + 0.4 ;
	color *= sin(( position.y) * 10.0 ) * 0.5 + 0.7 ;


	gl_FragColor = vec4( vec3( 1.0), color );

}