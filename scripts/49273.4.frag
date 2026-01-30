#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec2 p = vec2(atan(uv.x, uv.y), length(uv));
	float m = 6.28 / 6.;
	p.x = mod(p.x + m * .5, m) - m * .5;
	float d = p.y * cos(p.x);
	gl_FragColor.rgb += smoothstep(.6, .5, d) * smoothstep(.5, .6, d);
	gl_FragColor.rgb += smoothstep(1., .9, p.x * p.x);
	gl_FragColor.rgb *= smoothstep(.6, .5, d) * smoothstep(.5, .6, d);
	gl_FragColor.rgb *= (uv.y + .8);
	gl_FragColor.a = 1.;
}