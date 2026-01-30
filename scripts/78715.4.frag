#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float rnd(float seed) {
	return fract(sin(1.34232 + pow(seed, 1.014) * 89.72342433) * 328.2653653);
}

vec3 sphere(float num, float size, float rot) {
	if (num < size) {
		return vec3(num, abs(sin(rot)), 1.0);
	}
	else {
		return vec3(ceil(0.0));
	}
}

float centerX (vec2 resolution) {
	float a = resolution.x / resolution.y;
	return a / 2.0;
}

void main() {
	//resolution.x = 
	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.x *= resolution.x / resolution.y;
	
	float dim = distance(vec2(centerX(resolution) + 0.3 * cos(time), 0.5 + 0.3 *sin(time)), (st));
	
	vec3 col = sphere(dim, 0.2, time);

	
	//vec3 = col = col / 10.0;
	
	gl_FragColor = vec4(col, 1.0);
}
