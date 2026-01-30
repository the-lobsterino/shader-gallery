#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y) - 0.5;
	float th = atan(p.y, p.x);
	float ra = length(p);
	float sr = pow(ra, .2) * 10.0;

	float c = step(.5, fract(th / (sr / time)));
	gl_FragColor = vec4(c);
}