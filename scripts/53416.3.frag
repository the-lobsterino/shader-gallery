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
	float bar_width = .25;
	float bar_speed = .25;
	
	vec3 s = vec3(rnd);
	vec3 b = vec3(step(mod(-(time)*bar_speed, 1.0 + bar_width), bar_width+st.y) * 
		      step(mod((time)*bar_speed, 1.0 + bar_width), (1.0+bar_width)-st.y));
	
	gl_FragColor = vec4(s * 0.15 + b * 0.03, 1.0);
}
