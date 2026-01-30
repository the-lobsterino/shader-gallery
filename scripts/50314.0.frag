#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//repost
//fascinating form
//ive got something in mind for tomorrow you may appreciate
//sphinx


float ntsf(float x,float k) {
	return (x-x*k)/(k - abs(x) * 2.0 * k + 1.0);
}


void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	float l = length(uv);
	float a = atan(uv.x, uv.y);
	float m = 6.28 / 3.;
	a = mod(a + m / 2., m) - m / 2.;
	float d = abs(l * cos(a) - .2);
//	d = min(d, abs(uv.x) + .01);
	vec3 col = vec3(1.0-ntsf(d,-0.95));
	gl_FragColor = vec4(col, 1.);
}