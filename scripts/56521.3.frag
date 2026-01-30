#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float SmoothSquare(vec2 pos, vec2 center, float size) {
	vec2 test = (size - abs(center - pos)) / size * 3.;
	return min(max(0., test.x), max(0., test.y));
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	gl_FragColor = vec4(vec3(SmoothSquare(pos, vec2(.0, .0), 1.)), 1.);
}