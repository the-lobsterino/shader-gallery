#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xx;
	
	gl_FragColor = vec4(gl_FragCoord.x,resolution.x,0.0, 1.0);

}