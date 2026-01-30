#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st =  gl_FragCoord.xy / resolution.xy;
	
	st *= resolution.x / resolution.y;
	
	float d = length(st - vec2 (0.1));
	
	gl_FragColor = vec4(vec3(abs(fract(sin(time)*d*666.00 / PI))),1.0);

	

}