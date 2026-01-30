#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
 	vec2 position =  gl_FragCoord.xy;
	gl_FragColor = vec4( position.x / resolution.x,0,0,1) ;



}