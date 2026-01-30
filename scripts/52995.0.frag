// boilerplate unit circle thing

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 pos = (gl_FragCoord.xy/resolution.xy - 0.5) / vec2(resolution.y/resolution.x, 1.0) * 2.0;
	vec3 col = vec3(
		abs(pos.x),
		abs(pos.y),
		abs(length(pos)-1.0));
	col = pow(vec3(0.004)/col, vec3(min(resolution.x, resolution.y) / 128.0));
	gl_FragColor = vec4(col, 1.0);
}
