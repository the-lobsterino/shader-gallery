#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 position = (gl_FragCoord.xy) + 17000.0;
	gl_FragColor = vec4
	(
	sin(position.y  *  abs(sin(time))),
	sin(position.x  * (sin(time + 2.))),
	sin(-position.x * (sin(time)) + 2.),
	1.0
	);
}

/* Made in Turkey */