#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// hash no sine
float hash(vec2 p) {
	p = fract(p * vec2(765.54, 435.5));
	p += dot(p, p + 76.67);
	return fract(p.x * p.y * 85454.4);
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	gl_FragColor = vec4(col, 1.);
}