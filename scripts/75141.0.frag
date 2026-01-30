precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITER 10000
#define CENTER_X -0.789374599271466936740382412558
#define CENTER_Y 0.163089252677526719026415054868
#define SCALE 100.0

const float inv_scale = 1.0 / float(SCALE);
const vec2 center = vec2(CENTER_X, CENTER_Y);

float mandelbrot(vec2 c) {
	vec2 iter = c;
	for (int i = 0; i < MAX_ITER; i++) {
		float tmp = iter.x * iter.x - iter.y * iter.y;
		iter.y = 2.0 * iter.x * iter.y + c.y;
		iter.x = tmp + c.x;
		if (iter.x * iter.x + iter.y * iter.y > 4.0) {
			return float(i) + 2.0;
		}
	}
	return 1.0;
}

void main() {

	vec2 position = (2.25 * inv_scale * (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y) + center;
	
	float color = log(mandelbrot(position)) / log(float(MAX_ITER + 2));

	gl_FragColor = vec4( vec3( sqrt(color), color * color, clamp(16.0 * color * (0.5 - color), 0.0, 1.0) ), 1.0 );

}