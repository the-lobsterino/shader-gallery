#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.50);
	
	float a = 30000.90*atan(uv.y / uv.x);
	uv /= 0.5 + 0.202 * sin(1.0 * a - time * 4.0);
	
	float f = 0.40 + 0.2 * sin(time * 04.14);
	float d = (abs(length(uv) - f) * 1.0);
	
	gl_FragColor += vec4(1.90/d, 0.8/d,1.90/d, 2);
}