#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.141592653589793

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// samples per channel
#define NUM_SAMPLES 20
#define INTENSITY 0.05

float rand(vec3 co){
    return fract(sin(dot(co.xyz,vec3(12.9898,78.233,91.1743))) * 43758.5453);
}

float fetch(vec2 uv) {
	vec2 d = abs(uv - vec2(0.5));
	return step(0.0, (max(d.x,d.y)-0.2));
}

vec2 offset_line(float x) {
	return normalize(vec2(1.0)) * x;
}

vec2 offset_spiral(float x) {
	float a = x * 2.0 * M_PI * 0.3819444 * 1024.0;
	return vec2(cos(a),sin(a))*pow(x,1.0/1.618);
}

//#define offset offset_line
#define offset offset_spiral

float linsmoothtri(float x) {
    return smoothstep(0.0,1.0,abs(mod(x,2.0) - 1.0));
}

float f = 1.0 / float(NUM_SAMPLES);

float sample_color(vec2 uv, float r) {
	float o = 0.0;
	float c = 0.0;
	float s = mix(0.0, INTENSITY, linsmoothtri(uv.x+r*0.1+time)); 
	o = f * (rand(vec3(uv,mod(time+r*1.9142,1.0))));
	for (int i = 0; i < NUM_SAMPLES; ++i) {
		float j = float(i) * f;
		c += fetch(uv + offset(j+o)*s);		
	}
	return c * f;
}

const float shoulder_strength = 0.22; // 0.15
const float linear_strength = 0.30; // 0.5
const float linear_angle = 0.10;
const float toe_strength = 0.20;
const float toe_numerator = 0.01; // 0.02
const float toe_denominator = 0.30;

float exposure = 4.0;

const float linear_white = 11.2;

float ff_filmic(float x) {
    return (
    (x*(shoulder_strength*x+linear_angle*linear_strength)+toe_strength*toe_numerator)/
    (x*(shoulder_strength*x+linear_strength)+toe_strength*toe_denominator))
    - toe_numerator/toe_denominator;
}

vec3 ff_filmic3(vec3 x) {
    return (
    (x*(shoulder_strength*x+linear_angle*linear_strength)+toe_strength*toe_numerator)/
    (x*(shoulder_strength*x+linear_strength)+toe_strength*toe_denominator))
    - toe_numerator/toe_denominator;
}

vec3 ff_filmic_gamma3(vec3 linear) {
    vec3 x = max(vec3(0.0), linear-0.004);
    return (x*(x*6.2+0.5))/(x*(x*6.2+1.7)+0.06);
}

vec3 srgb2lin(vec3 color) {
    return color * (color * (
        color * 0.305306011 + 0.682171111) + 0.012522878);
}

vec3 lin2srgb(vec3 color) {
    vec3 S1 = sqrt(color);
    vec3 S2 = sqrt(S1);
    vec3 S3 = sqrt(S2);
    return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;
}

vec3 tonemap(vec3 color) {
    color = ff_filmic3(color * exposure) / ff_filmic(linear_white);
    color = clamp(color, 0.0, 1.0);
    return lin2srgb(color);
}

void main(void) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 c = uv;
	float aspect = resolution.x / resolution.y;
	uv -= 0.5;
	uv.x *= aspect;
	uv += 0.5;
	
	vec3 color = vec3(
		sample_color(uv, 0.0),
		sample_color(uv, 1.0),
		sample_color(uv, 2.0));
	
	gl_FragColor = vec4(tonemap(color), 1.0);
}