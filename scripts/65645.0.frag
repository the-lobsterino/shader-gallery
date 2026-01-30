#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 pos = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
	pos.x *= resolution.x / resolution.y;
	float len = length(pos);
	float r = (degrees(atan(pos.y, pos.x)) + 180.0) / 360.0;
	float c = fract(r + len * 4.0 - time);
	gl_FragColor = vec4(c, c, c, 1);
}
