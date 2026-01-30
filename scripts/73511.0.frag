#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4( mix(
		vec3(0.8, 0.6, 0.7), 
		vec3(0.4, 0.1, 0.2), 
		gl_FragCoord.x / resolution.x), 1.0 );

}