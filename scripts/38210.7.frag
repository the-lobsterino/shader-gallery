#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159265359

void main( void ) {

	vec4 strong_white = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 strong_black = vec4(0.0, 0.0, 0.0, 1.0);
	
	vec2 position = (gl_FragCoord.xy);
	vec2 lower = vec2(100.0, 100.0);
	vec2 upper = vec2(200.0, 200.0);
	if( (position.x <= upper.x && position.x >= lower.x) && (position.y <= upper.y && position.y >= lower.y)  ){
			gl_FragColor = strong_white;
	} else {
		gl_FragColor = strong_black;	
	}
}