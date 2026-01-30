#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, float r) {
	return length(p) - r;
}

float box(vec2 p, vec2 s) {
	vec2 d = abs(p) - s;
	return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec2 foldX(vec2 p) {
	p.x = abs(p.x);
	return p;
}

vec2 foldOrigin(vec2 p) {
	return abs(p);
}

float scene(vec2 p) {
	p = abs(p * 1.5) - 1.0;
	p = foldOrigin(p) - vec2(0.5 + 0.2 * sin(time), 0.5 + 0.2 * sin(time *2.0));
	return mix(
		circle(p, 0.2),
		box(p, vec2(0.2, 0.2)),
		sin(time * 1.0) * 0.5 + 0.5
	);
}

vec3 sample(vec2 p) {
	float d = scene(p);

	vec3 c = d < 0.0 ? mix(vec3(0.15), vec3(0.8, 0.8, 0.3), pow(sin(d * 200.0) * 0.5 + 0.5, 0.5))
		: mix(vec3(0.15), vec3(0.45, 0.35, 0.85), pow(sin(d * 200.0) * 0.5 + 0.5, 0.5));
	
	return mix(c, vec3(2.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));
}

void main( void ) {
	
	vec2 st = (2.0 * gl_FragCoord.xy  - resolution) / min(resolution.x, resolution.y);
	
	vec3 c = sample(st);
	
	gl_FragColor = vec4(c, 1.0);

}