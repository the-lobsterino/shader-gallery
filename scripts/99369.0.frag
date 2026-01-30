#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*

	HAPPY BLM EVEYBODY!!
	VEC3(0.0, 0.0, 0.0) LIVES MATTER!!!

		- bigblackmenlover0938 glsl shader group

*/

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(0.0, 0.0, 0.0);
	gl_FragColor = vec4(color, 1.0);
}