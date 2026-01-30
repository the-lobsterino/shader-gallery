#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// so here's an easy one... if two things were revolving in opposite
// directions and one was going twice as fast as the other, how many
// unique times would they pass each other during one full revolution
// by the slower item... and of course the answer is three because
// the slower one goes 1/3 of the way around and the faster goes 2/3
// <response>neato

void main(void)
{
	vec2 pos = gl_FragCoord.xy / resolution - 0.5;
	pos.x /= resolution.y / resolution.x;
	float pi = atan(1.0, 0.0) * 2.0;
	float band = smoothstep(0.35, 0.36, length(pos)) - smoothstep(0.45, 0.46, length(pos));
	float ang = atan(pos.y, pos.x) + pi;
	float t1 = mod(time, 2.0 * pi);
	float t2 = mod(time * -3.5, 2.0 * pi);
	float s1 = 0.1/distance(ang, t1) + 0.1/distance(ang, t1 - 2.0 * pi) + 0.1/distance(ang, t1 + 2.0 * pi); //hamfisted mess to deal with branch cut
	float s2 = 0.1/distance(ang, t2) + 0.1/distance(ang, t2 - 2.0 * pi) + 0.1/distance(ang, t2 + 2.0 * pi);
	gl_FragColor = vec4(band * s1, band * s2, band * 0.25, 1.0);
}
