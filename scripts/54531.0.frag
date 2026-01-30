#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float pendulum_angle = cos(time * 1.2) + 3.14 / 2.0;
	p += vec2(cos(pendulum_angle), sin(pendulum_angle) - 0.7) * 0.5;
	float a = atan(p.y, p.x);
	float r = length(p);
	float s1 = sin(a + 4.0 / (r + 0.08) + time * 4.0);
	
	gl_FragColor = vec4(s1 > 0.5 ? 0.3 : 0.2, 0.0, cos(time) / 6.0 + 0.3, 1.0);
}