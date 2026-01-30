#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 color = distance(position, vec2(0.0));


	gl_FragColor = vec4( vec3( color, 0.0), 1.0 );

}