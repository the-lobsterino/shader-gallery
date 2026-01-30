#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	vec2 position = (gl_FragCoord.xy/resolution.xy);
	
	if(position.x < 0.33333333){
		gl_FragColor = vec4( .0, .0, .6, 1.0 );
	} 
	else if(position.x < 0.66666666){
		gl_FragColor = vec4(  1 );
	} else {
		gl_FragColor = vec4( .8, .0, .0, 1.0 );
	}}