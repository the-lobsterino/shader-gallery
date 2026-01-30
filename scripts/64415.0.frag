#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 st) {
	return fract(sin(dot(st.xy,
			     vec2(12.9898,78.233))) *
		     43758.5453123);
}

void main() {
	vec2 st = gl_FragCoord.xy/resolution.xy;
	float rnd = random( st * time / 20.0);
	
	vec3 s = vec3(rnd);
	vec3 b = vec3(step(mod(-(time)/4.0, 1.15), .15+st.y) * step(mod((time)/4.0, 1.15), 1.15-st.y));
	
	gl_FragColor = vec4(s * 0.15 + b * .05, 1.0);
}
