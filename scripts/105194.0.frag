#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 2.0;

	gl_FragColor = vec4( vec3( color, color * 5.5, sin( color + time / 3.0 ) * 0.75 ), 0.0 );

}