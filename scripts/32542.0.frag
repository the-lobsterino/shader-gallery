#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//tests color banding on monitors
	gl_FragColor = vec4( vec3(gl_FragCoord.x / resolution.x), 1.0 );

}