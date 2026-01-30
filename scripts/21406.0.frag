#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iterations = 20;

float s(float x) {
	float f = fract(x);
	
	if (f >= 0.5) {
		return ceil(x) - x;
	}
	
	return x - floor(x);
}

bool is_blancmange_point(vec2 v) {
	float max_y = 0.0, p = 0.0;
	
	for (int n = 0; n < iterations; ++n) {
		p = pow(2.0, float(n));
		max_y = max_y + s(v.x*p)/p;
	}
	
	if (v.y <= max_y) {
		return true;
	}
	
	return false;
}
	
void main(void) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	if (is_blancmange_point(gl_FragCoord.xy)) {
		gl_FragColor = vec4(206.0/255.0, 70.0/255.0, 118.0/255.0, 0.0);
	}
}