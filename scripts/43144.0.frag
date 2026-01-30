// author @aa_debdeb (https://twitter.com/aa_debdeb)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define N 30
#define PI 3.14

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
} 

float sphere(vec3 center, float radius, vec3 ray, vec3 origin) {
	vec3 oc = origin - center;
	float a = dot(ray, ray);
	float b = 2.0 * dot(oc, ray);
	float c = dot(oc, oc) - radius * radius;
	float disc = b * b  - 4.0 * a * c;
	return disc > 0.0 ? (-b - sqrt(disc)) / (2.0 * a) : -1.0;
}

vec3 color(vec3 ray, vec3 origin) {
	vec3 center = vec3(0.0, 0.0, 0.0);
	float t = sphere(center, 0.5, ray, origin);
	if (t > 0.0) {
		vec3 p = origin + ray * t;
		vec3 n = normalize(p - center);
		return 0.5 * (vec3(n.x, n.y, n.z) + 1.0);
	}
	
	float y = clamp(ray.y, -1.0, 1.0) * 0.5 + 0.5;
	return (1.0 - y) * vec3(1.0, 1.0, 1.0) + y * vec3(0.5, 0.5, 1.0);
}

vec3 cam(vec2 st, vec3 origin, vec3 target, vec3 vup,  float fov, float aspect) {
	float theta = fov * PI / 180.0;
	float halfH = tan(theta / 2.0);
	float halfW = aspect * halfH;
	vec3 back = normalize(origin - target);
	vec3 up = normalize(cross(vup, back));
	vec3 right = cross(back, up);

	return right * halfW * st.x + up * halfH *st.y - origin;
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / min(resolution.x, resolution.y) * 2.0 - resolution.xy / min(resolution.x, resolution.y);	
	
	vec3 c = vec3(0.0);
	for(int i = 0; i < N; i++) {
		vec3 origin = vec3(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0, 1.0);
		vec2 offset = vec2(random(st + float(i)), random(st + float(i) + 5.0)) / min(resolution.x, resolution.y) * 2.0 - vec2(1.0, 1.0) / min(resolution.x, resolution.y);
		vec3 target = vec3(st + offset, 0.0);
		vec3 ray = target - origin;
		c += color(ray, origin);
	}
	c  /= float(N);
		
	gl_FragColor = vec4(c, 1.0);

}