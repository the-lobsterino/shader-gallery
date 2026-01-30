// ring array by @kapsy1312
// Checkerboard.
// simplified -- novalis
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 pos = (gl_FragCoord.xy*2.-resolution)/resolution.y * 10.;
	pos += time;
	gl_FragColor = vec4(dot(sin(pos),cos(pos)) < 0. ? vec4(1) : vec4(0));
}