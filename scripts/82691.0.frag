#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float random(vec2 pos) {
	return fract(1.0 * sin(pos.y + fract(100.0 * sin(pos.x))));
}

float noise(vec2 pos) {
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 pos) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100.0);
	mat2 rot = mat2(cos(0.15), sin(0.15), -sin(0.25), cos(0.5));
	for (int i=0; i < 12; i++) {
		v += a * noise(pos);
		pos = rot * pos * 2.0 + shift;
		a *= 0.55;
	}
	return v;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Foil easy simulation
// 1.0 - 10.0
#define DISTORSION 3.0

void main() {
	vec2 pos = (gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);

	float f = fbm(pos);
	
	float h = DISTORSION*f + pos.y + 0.1*cos(2.*mouse.y - 1.) + 0.1*sin(2.*mouse.x - 1.);
	
	vec3 colour = hsv2rgb(vec3(h, 0.8, 0.8));
	
	gl_FragColor = vec4(colour, 1.0);
}