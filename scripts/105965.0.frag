#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// Discord: thanur
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += dot(position.y, position.x);
	gl_FragColor = vec4( vec3( dot(position.y, cos(time)), color, dot(position.y, position.y)), 1.0 );

}