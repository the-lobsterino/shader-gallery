#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);

	float r = length(p) * 2.;
	float t = sin(2. * time) * exp(-r * r / 2.);
	vec4 color1 = vec4(1., .8, .8, 1.), color2 = vec4(.2, .2, 1., 1.);
	gl_FragColor = (1. - t) * color1 + t * color2;
}