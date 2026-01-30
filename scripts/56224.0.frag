#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (1. * gl_FragCoord.xy - resolution) / resolution.y;
	
	uv *= 1.;
	vec3 col = vec3(0.);
	float k = cos(uv.y + time);
	float d = abs(uv.x - k * 0.1);
	d = min(d, abs(uv.x + k * 0.1));
	float m = 0.1;
	uv.y = mod(uv.y, m) - m * 0.1;
	k = abs(k);
	k -= 0.1 * k;
	uv.x -= clamp(uv.x, -k, k);
	d = min(d, length(uv));	
	col += smoothstep(0.01, 0.01, d);
	gl_FragColor = vec4(col, 1.);

}