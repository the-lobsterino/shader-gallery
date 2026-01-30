#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const int ITERATIONS = 700;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 square(vec2 z) {
	return vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y);
}

float mod2(float x) {
	if (x < 2.0) return x;
	if (x <= 4.0) return x - 2.0;
	if (x <= 6.0) return x - 4.0;
	if (x <= 8.0) return x - 6.0;
	return 0.0;
}

vec4 speed_to_color(float speed) {
	float C = 1.0;
	float H_prime = speed * 6.0;
	float X = C*(1.0 - abs(mod2(H_prime) - 1.0));
	
	if (0.0 <= H_prime && H_prime < 1.0) return vec4(C, X, 0.0, 1.0);
	if (1.0 <= H_prime && H_prime < 2.0) return vec4(X, C, 0.0, 1.0);
	if (2.0 <= H_prime && H_prime < 3.0) return vec4(0.0, C, X, 1.0);
	if (3.0 <= H_prime && H_prime < 4.0) return vec4(0.0, X, C, 1.0);
	if (4.0 <= H_prime && H_prime < 5.0) return vec4(X, 0.0, C, 1.0);
	return vec4(C, 0.0, X, 1.0);
}

vec4 get_pixel_color(float x, float y) {
	vec2 z = vec2(0.0, 0.0);
	vec2 c = vec2(x, y);
	for (int i = 0; i < ITERATIONS; ++i) {
		z = square(z) + c;
		if (z.x*z.x + z.y*z.y > 2.0) {
			float speed = float(i)/float(ITERATIONS);
			return speed_to_color(speed);
		}
	}
	return vec4(0.0, 0.0, 0.0, 1.0);
}

void render_center(float x, float y, float s_x, float s_y, float size) {
	gl_FragColor = get_pixel_color(x + size*s_x, y + size*s_y);
}


float get_size() {
	int section = int(time/6.0);
	float part = time - 6.0*float(section);
	if (mod(float(section), 2.0) < 1.0) {
		return 1.0/(part*part*part*part + 0.001);
	}
	return 1.0/(36.0*36.0 - part*part*part*part + 0.001);
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy)*2.0 - 1.0;
	
	float center_x = -0.7690;
	float center_y = 0.1004 + (time/100000.0);
	render_center(center_x, center_y, position.x, position.y, 1.0/(36.0*36.0));

}