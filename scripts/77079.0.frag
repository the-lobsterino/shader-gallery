#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

	vec3 color = 0.0;
	

	gl_FragColor = vec4(color, 1.0)

}