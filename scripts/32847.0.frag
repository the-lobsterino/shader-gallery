#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	float a = atan(uv.y / uv.x);
	uv /= 0.5 + 0.02 * tan(9.0 * a + time );
	
	float r = (abs(length(uv) - 0.5) * 20.0);
	float g = (abs(length(uv) - 1.0) * 20.0);
	float b = (abs(length(uv) - 1.5) * 20.0);
	
	gl_FragColor = vec4(1.0 / r, 1.0 / g, 1.0 / b, 1);
}