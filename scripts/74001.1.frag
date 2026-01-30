#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define c_sum(a, b) vec2(a + b)
#define c_product(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)

float map(float value, float in_min, float in_max, float out_min, float out_max) {
	return out_min + (value - in_min) * (out_max - out_min) / (in_max - in_min);
}


void main( void ) {
	vec2 position = 2.0 * (gl_FragCoord.xy / resolution.xy) - vec2(2.5 / 2.0, 1.0 / 2.0);
	float scale = 1.0;
	
	vec2 x = vec2(0.0, 0.0);
	vec2 c = vec2(
		map(gl_FragCoord.x / resolution.x, 0.0, 1.0, -2.0 / scale, 1.0 / scale),
		map(gl_FragCoord.y / resolution.y, 0.0, 1.0, -1.25 / scale, 1.25 / scale)
	);
	
	const int kIter = 100;
	const float kIterF = float(kIter);
	for (int i = 0; i < kIter; ++i) {
		x = c_sum(x, c);
		x = c_product(x, x);
	
		const float threshold = 10.0;
		if (dot(x, x) > threshold * threshold){
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			return;
		}
	}
	
	float l = length(x);
	gl_FragColor = vec4(mod(l, 1.0), mod(l, 0.3), mod(l, 0.7), 1.0);
}