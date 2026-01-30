#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(in vec2 st) {
	return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.545123);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(random(i + vec2(0.0, 0.0)), 
			     random(i + vec2(1.0, 0.0)), u.x), 
		   mix(random(i + vec2(0.0, 1.0)), 
			     random(i + vec2(1.0, 1.0)), u.x), u.y);
}

float lines(in vec2 pos, float b) {
	float scale = 10.0;
	pos *= scale;
	return smoothstep(0.0, 100.5 + b * 0.5, abs(sin(pos.x * 3.1415) + b * 2.0) * .5);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution;
	st.x *= resolution.x / resolution.y;

	vec2 pos = st.yx* vec2(10.0, 3.0);
	
	float pattern = pos.x;
	
	pos += rotate2d((noise(pos + time) * 2.0 - 1.0) * 3.1415) * vec2(noise(pos - time * 0.2) * 2.0 - 1.0, noise(pos + vec2(100.0) - vec2(time) * 0.2) * 2.0 - 1.0);
	
	pattern = lines(pos, 0.5);
	
	gl_FragColor = vec4(vec3(pattern), 1.0);
}