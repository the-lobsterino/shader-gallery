#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITERATIONS 100
#define SPEED 0.2

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

vec3 mandelbrot(vec2 p) {
	vec2 z = vec2(0);
	vec2 c = p.xy * 2.0;
	for (int i = 0; i < MAX_ITERATIONS; i++) {
		if (length(z) > 2.0) {
			return vec3(1, 2, 1) * (float(i) / 50.0) + vec3(0, 0, 0.5);
		}
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
	}
	return vec3(0);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	//ADJUST POSITION
	uv *= 2.;
	uv -= 1.;
	uv /= 25.;
	uv *= (sin(time * SPEED) + 1.) / 2.;
	uv.x -= 0.65;
	uv.y += 0.03;
	//ADJUST POSITION
	gl_FragColor = vec4(mandelbrot(uv), 1);
}
