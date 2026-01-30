#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float hash(vec2 uv) {
	return fract(74455.45 * sin(dot(vec2(78.54, 14.45), uv)));
}

vec2 hash2(vec2 uv) {
	float  k = hash(uv);
	return vec2(k, hash(uv + k));
}

float manhat(vec2 uv) {
	return abs(uv.x) + abs(uv.y);
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec2 st = gl_FragCoord.xy / resolution;
	vec3 col = vec3(0.);
		
	uv *= 51.;
	uv.y += time * 0.5;
	vec2 i = floor(uv);
	vec2 f = 1.5 * fract(uv) - 1.;
	

	f -= 3.9 * hash2(i);
	float s = hash(i*2.0)*0.1;
	col += smoothstep(.55+s, -.11+s, manhat(f));
	gl_FragColor = vec4(col, 1.);
}