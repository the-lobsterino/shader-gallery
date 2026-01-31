#extension GL_OES_standard_derivatives : enable
// https://discord.gg/1htiras free gore videos
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy * 5.0) + mouse / 4.0;

	float color = 0.0;
	color = (1.0 - (pow((position.x - 0.8) - 1.2, 2.0) + pow((position.y) - 4.2, 2.0))) * 45.0;
	color -= (1.0 - (pow((position.x - 1.8) - 1.2, 2.0) + pow((position.y) - 4.2, 2.0))) + 21.0;
	color -= position.x * 4.0;
	color = color;
	gl_FragColor = vec4( vec3( color * 0.2, color * 0.8, color - sin(1244.0 * 4.0) ), 1.0 );

}