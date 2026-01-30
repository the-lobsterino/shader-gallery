#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float step_o(float a, float b){
     return b > a ? 1. : 0.;
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.y * 10.;
	int i = 0;
	pos += cos(pos.x);
	pos = fract(pos);
	float color = step_o(pos.x,.9)*step_o(pos.y,.9);
	gl_FragColor = vec4(color);
}