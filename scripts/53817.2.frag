#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() { 
	gl_FragColor = (gl_FragCoord.y / resolution.y > 0.3) ? .6 + .59 * cos(2.*1.0 + 6.28 * (floor(64.0*gl_FragCoord.y / resolution.x)/64.0) + vec4(10, 2,8, 1))
		: .6 + .59 * cos(2.*3.0 + 6.28 * (floor(64.0*gl_FragCoord.y / resolution.x)/64.0) + vec4(10, 2,8, 1));
}