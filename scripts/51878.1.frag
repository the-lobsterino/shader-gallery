// author @aa_debdeb (https://twitter.com/aa_debdeb)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define SAMPLING_NUM 10
#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 translate(vec3 p, vec3 offset) {
	return p - offset;
}

float box(vec3 p, vec3 size) {
	return length(max(abs(p) - size / 2.0, 0.0));
}

float scene(vec3 p) {

	vec3 bp = translate(p, vec3(0.0, 0.0, 0.0));
	return box(bp, vec3(1.0, 1.0, 1.0));
}

vec3 normal(vec3 p) {
	float d = 0.00001;
	return normalize(vec3(
		scene(p + vec3(d, 0.0, 0.0)) - scene(p + vec3(- d, 0.0, 0.0)),
		scene(p + vec3(0.0, d, 0.0)) - scene(p + vec3(0.0, - d, 0.0)),
		scene(p + vec3(0.0, 0.0, d)) - scene(p + vec3(0.0, 0.0, - d))
	));
}

vec3 cam(vec2 st, vec3 origin, vec3 target, vec3 vup, float vfov, float aspect) {
	vec2 uv = st * 2.0 - 1.0;
	float radian = vfov * PI / 180.0;
	float h = tan(radian * 0.5);
	float w = h * aspect;
	vec3 front = normalize(target - origin);
	vec3 right = cross(front, normalize(vup));
	vec3 up = cross(right, front);
	
	return normalize(right * w * uv.x + up * h * uv.y + front);	
}

vec3 background(float v) {
	return (1.0 - v) * vec3(0.8) + v * vec3(0.7, 0.7, 1.0);
}

void main( void ) {
	
	vec3 origin = vec3(mouse.x * 10.0 - 5.0, mouse.y * 10.0 - 5.0, 5.0);
	vec3 target = vec3(0.0, 0.0, 0.0);
	
	vec3 color = vec3(0.0);
	for (int si = 0; si < SAMPLING_NUM; si++) {
		vec2 r =  vec2(random(gl_FragCoord.xy * 0.01 + float(si)), random(gl_FragCoord.xy * 0.01 + float(si) + 0.5));
		vec2 st = (gl_FragCoord.xy + r) / resolution;
		vec3 ray = cam(st, origin, target, vec3(0.0, 1.0, 0.0), 60.0, resolution.x / resolution.y);
	
		float d = 0.0;
		float t = 0.0;
		vec3 p = origin;
		for(int i = 0; i < 64; i++) {
			d = scene(p);
			p += ray * d;
		}
		color += abs(d) < 0.001 ? (normal(p) + 1.0) * 0.5 :  background(clamp(ray.y, -1.0, 1.0) * 0.5 + 0.5);
	}
	color /= float(SAMPLING_NUM);
	
	gl_FragColor = vec4(color, 1.0);
	
}