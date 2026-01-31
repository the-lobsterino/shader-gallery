#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 1.0;
	color *= sin( time / 10.0 );

	gl_FragColor = vec4( vec3(color, color, color), 1.0 );

}