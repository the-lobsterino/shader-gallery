#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;    
	float pi = 3.1415953345265358979;
	float angle = atan(p.y, p.x)/pi*0.4 + 0.5;
	float f = floor(fract(angle*1340.0) + 0.5);
	gl_FragColor = vec4(f);
}