#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec2 st, float a, float b, float d) {
	return pow(1.0-distance(st, vec2(0.5 + 0.4*sin(a*time + d), 0.5 + 0.4*sin(b*time))), 100.0);
}

void main( void ) {
	vec2 st = gl_FragCoord.xy/resolution.xy;
	float t = f(st, 3.0, 4.0, 3.14*0.25);
	gl_FragColor = vec4(t*0.3, t, t*0.2, 1.0);
}
