#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 color_inside = vec3(0, 0, 0);
const vec3 color_outside = vec3(1, 1, 1);
const vec3 color_strip = vec3(1, 0, 0);

const float ANIMATION_SPEED = 0.5;
const float GRADIENT_FACTOR = 80.0;
const float DARKENING_FACTOR = 2.0;
const float PI = 3.1415926535897932384626433832795;

float cycleTime() {
	return mod(time * ANIMATION_SPEED, 1.0);
}

float radiusTranslation(float x) {
	return 1.0 / x;
}

float timeTranslation() {
	return cycleTime() * 2.0 * PI;
}

float mixFunction(float x) {
	return sin(radiusTranslation(x) + timeTranslation());
}

vec3 sharpMix(vec3 a, vec3 b, float x, float gf) {
	return mix(a, b, clamp(x * gf - gf / 2.0, 0.0, 1.0));
}

float gf(float radius) {
	return radius * GRADIENT_FACTOR;
}

vec3 color(float radius) {
	return sharpMix(color_inside, color_outside, mixFunction(radius), gf(radius)) * clamp(sqrt(radius * DARKENING_FACTOR), 0.0, 1.0);
}

void main(void) {
	float ratio = resolution.x / resolution.y;
	vec2 pos = ((gl_FragCoord.xy / resolution.xy) - 0.5) * vec2(ratio, 1.0);	
	float radius = sqrt(pos.x * pos.x + pos.y * pos.y);
	
	gl_FragColor = vec4(color(radius), 1.0);
}