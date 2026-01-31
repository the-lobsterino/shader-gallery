#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.141592653589793

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM_SAMPLES 1024
#define INTENSITY 0.3

const float r = 0.01;

float rand(vec3 co){
    return fract(sin(dot(co.xyz,vec3(12.9898,78.233,91.1743))) * 43758.5453);
}

float fetch(vec2 uv) {
	vec2 d = uv - vec2(0.5);
	return 1.0 - step(0.0, length(d)-r);
}

vec2 offset_line(float x) {
	return normalize(vec2(1.0)) * x;
}

float f(float x) {
	return x;	
}

vec2 offset_spiral(float x) {
	float a = x * 2.0 * M_PI * (sqrt(5.0) * 0.5 + 0.5);
	
	float d = sqrt(x / float(NUM_SAMPLES));
	
	return vec2(cos(a),sin(a))*f(d);
}

//#define offset offset_line
#define offset offset_spiral

float linsmoothtri(float x) {
    return smoothstep(0.0,1.0,abs(mod(x,2.0) - 1.0));
}

void main(void) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy);
	vec2 c = uv;
	float aspect = resolution.x / resolution.y;
	uv -= 0.5;
	uv.x *= aspect;
	uv += 0.5;
	
	float color0 = 0.0;
	float f = 1.0 / float(NUM_SAMPLES);
	float o = 0.0;
	o = (rand(vec3(uv,mod(time,5.5))));
	float s = INTENSITY; 
	for (int i = 0; i < NUM_SAMPLES; ++i) {
		float j = float(i);
		color0 += fetch(uv + offset(j )*s);	
	}
	float color = color0;
	gl_FragColor = vec4(vec3(pow(color * INTENSITY * INTENSITY / (r * r) * f,2.2)), 1.0);
}