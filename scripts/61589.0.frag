#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 pos = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	float p = mouse.x * 62.0 + 0.5;
	float squircle = (p*0.01)/distance(pow(abs(pos.x), p) + pow(abs(pos.y), p), 0.55);
	vec3 col = vec3(0.5 + 0.5 * sin(time), 0.6 + 0.3*cos(time), 0.2);
	gl_FragColor = vec4(vec3(squircle) * col, 1.0);
}