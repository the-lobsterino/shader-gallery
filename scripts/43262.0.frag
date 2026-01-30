#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float smooth(float d1, float d2, float k) {
	float h = exp(-k * d1) + exp(-k * d2);
	return -log(h) / k;
}

vec3 repete(vec3 p, vec3 interval) {
	return mod(p, interval) - interval / 2.0;
}

vec3 rotateX(vec3 p, float angle) {
	return vec3(
		p.x,
		cos(-angle) * p.y - sin(-angle) * p.z,
		sin(-angle) * p.y + cos(-angle) * p.z
	);
}

vec3 translate(vec3 p, vec3 offset) {
	return p - offset;
}

float plane(vec3 p) {
	return abs(dot(p, vec3(0.0, 1.0, 0.0)));
}

float sphere(vec3 p, float radius) {
	return length(p) - radius;
}

float box(vec3 p, vec3 size) {
	return length(max(abs(p) - size / 2.0, 0.0));
}

float scene(vec3 p) {	
	vec3 q = translate(p, vec3(0.0, 0.0, time * 3.0));
	
	float dFloor = plane(translate(p, vec3(0.0, -3.0, 0.0)));
	float dCeil = plane(translate(p, vec3(0.0, 3.0, 0.0)));
	float dColumn = box(repete(translate(q, vec3(0.0, 0.0, 0.0)), vec3(5.0, 0.0, 5.0)), vec3(0.5, 10.0, 0.5));
	
	return smooth(dColumn, min(dFloor, dCeil), 4.0);
}

vec3 normal(vec3 p) {
	float d = 0.00001;
	return normalize(vec3(
		scene(p + vec3(d, 0.0, 0.0)) - scene(p + vec3(- d, 0.0, 0.0)),
		scene(p + vec3(0.0, d, 0.0)) - scene(p + vec3(0.0, - d, 0.0)),
		scene(p + vec3(0.0, 0.0, d)) - scene(p + vec3(0.0, 0.0, - d))
	));
}

void perspective(in vec2 st, in vec3 position, in vec3 target, in vec3 vup, in float vfov, in float aspect, out vec3 origin, out vec3 ray) {
	vec2 uv = st * 2.0 - 1.0;
	float radian = vfov * PI / 180.0;
	float h = tan(radian * 0.5);
	float w = h * aspect;
	vec3 front = normalize(target - position);
	vec3 right = cross(front, normalize(vup));
	vec3 up = cross(right, front);
	
	ray = normalize(right * w * uv.x + up * h * uv.y + front);	
	origin = position;
}


void main( void ) {
	vec2 st = gl_FragCoord.xy / resolution;
	
	vec3 position = vec3(mouse.x * 10.0 - 5.0, 0.0, 5.0);
	vec3 target = vec3(0.0, 0.0, 0.0);
	
	vec3 lightPos = vec3( 10.0 * sin(time), 0.0, -5.0);

	vec3 origin, ray;
	perspective(st, position, target, vec3(0.0, 1.0, 0.0), 60.0, resolution.x / resolution.y, origin, ray);
	
	float d = 0.0;
	vec3 p = origin;
	for(int i = 0; i < 256; i++) {
		d = scene(p);
		p += ray * d;
	}
	
	vec3 lightDir = normalize(lightPos - p);
	vec3 color = abs(d) < 0.001 ? clamp(dot(normal(p), lightDir), 0.0, 1.0)  * vec3(1.0, 1.0, 1.0) + vec3(0.2) :  vec3(0.0);
	
	gl_FragColor = vec4(color, 1.0);
	
	

}