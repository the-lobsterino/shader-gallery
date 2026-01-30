// 星野源 - 恋
// https://www.youtube.com/watch?v=jhOVibLEDhA

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tile(vec2 uv){
	return step(
		0.0,
		(fract(uv.x) * 2.0 - 1.0) * (fract(uv.y) * 2.0 - 1.0)
	);
}

vec2 rotate(vec2 uv, float theta){
	return uv * mat2(
		cos(theta), sin(theta),
		-sin(theta), cos(theta)
	);
}

vec3 koi(){
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float t = 0.1 * time * 2.0 * 3.14159265358979;
	uv -= vec2(0.5, 2.1 - cos(t) * 1.1);
	uv *= vec2(1.0, resolution.y / resolution.x);
	uv = rotate(uv, sin(t) * 0.3);
	uv.y = (0.5 - cos(t) * 0.3) / uv.y; uv.x *= uv.y;
	uv.y += (0.35 + cos(t) * 0.1) * (resolution.x / resolution.y);
	uv = rotate(uv, t);
	float val = step(0.5, tile(uv * 16.0) + step(0.25, length(uv)));
	return (val < 0.5) ? vec3(0.05) : vec3(0.9, 0.98, 1.0);
}

void main(void) {
	gl_FragColor = vec4(koi(), 1.0);
}