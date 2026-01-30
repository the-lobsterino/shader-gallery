#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 COLOR_0 = vec3(0.5, 0.0431372549, 0.0431372549);
const vec3 COLOR_1 = vec3(0.73725490196, 0.34117647058, 0.34117647058);
const vec3 COLOR_2 = vec3(0.65098039215, 0.19215686274, 0.19215686274);
const vec3 COLOR_3 = vec3(0.85098039215, 0.5, 0.5);

const float ANIMATION_SPEED = 0.5;
const float GRADIENT_FACTOR = 92.0;
const float DARKENING_FACTOR = 2000000.0;
const float PI = 3.1415926535897932384626433832795;
const float SINGULARITY_OFFSET = 0.03;
const float CUTOFF = 0.025;

float cycleTime() {
	return mod(time * ANIMATION_SPEED, 1.0);
}

float radiusTranslation(float x) {
	return (1.0 / (x + SINGULARITY_OFFSET));
}

float timeTranslation() {
	return cycleTime() * 2.0 * PI;
}

float oldMixFunction(float x) {
	return sin(radiusTranslation(x) + timeTranslation());
}

float mixFunction(float x) {
	return cos(radiusTranslation(x) + timeTranslation());
}

vec3 sharpMix(vec3 a, vec3 b, float x, float gf) {
	return mix(a, b, clamp(x * gf - gf / 2.0, 0.0, 1.0));
}

float gf(float radius) {
	return radius * GRADIENT_FACTOR;
}

vec3 mix4(vec3 a, vec3 b, vec3 c, vec3 d, float x, float r) {
	x = x * 4.0;
	return sharpMix(
		sharpMix(a, b, (x + 3.0) * 2.0, gf(r)),
		sharpMix(c, d, x - 3.0, gf(r)),
		x - 1.0, gf(r));
}

vec3 color(float radius) {
	return mix4(COLOR_0, COLOR_1, COLOR_2, COLOR_3, mixFunction(radius), radius);
}

void main(void) {
	float ratio = resolution.x / resolution.y;
	vec2 pos = ((gl_FragCoord.xy / resolution.xy) - 0.5) * vec2(ratio, 1.0);	
	float radius = sqrt(pos.x * pos.x + pos.y * pos.y);
	
	gl_FragColor = vec4(color(radius), 1.0);
}