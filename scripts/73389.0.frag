#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float l = 1.0 - length(position - vec2(0.5, 0.5));

	float color = 1.0;

	gl_FragColor = vec4( vec3( l * 0.2, l  * 0.8, l * 0.9 ), 1.0 );

}