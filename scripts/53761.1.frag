#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	gl_FragColor = .6 + .59 * cos(time + 6.28 * (gl_FragCoord.x / resolution.y) + vec4(23, 21, 0, 0));
}