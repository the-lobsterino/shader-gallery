#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy/resolution.xy;
	
	vec2 dif = pos - mouse;
	
	float dist = 1.0-length(dif);
	float power = pow(dist, 10.0);
	float pulse = sin(time*20.0);	
	
	gl_FragColor = vec4(pos*dist, pulse*power, 1.0);

}