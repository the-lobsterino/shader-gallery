#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	float color = step(0.1, distance(vec2(0.5), pos));
	
	
	
	gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}