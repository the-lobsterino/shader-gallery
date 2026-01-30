/*
	iscg-2021-assignment-r1-ray-tracing
	05201009
	工夫点: 物体をマウスで動かせるようにした
*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795
#define OBJECT_NUM 2

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
	
struct Intersection {
	bool exists;
	float dist;
	vec3 position;
	vec3 normal;
};
	
struct Light {
	vec3 position;
	float strength;
};

struct Sphere {
	float radius;
	vec3 center;
};

vec3 generate_camera_ray(vec2 pixel, vec3 origin) {
	
	float film_w = 10.0;
	float film_h = 10.0;
	
	float x = film_w * pixel.x;
	float y = film_h * pixel.y;
	
	// distance to film
	float z = 10.0;

	return normalize(origin - vec3(x, y, z));
}

Intersection intersect(vec3 ray, vec3 origin, Sphere sphere) {
	
	float a = ray.x * ray.x + ray.y * ray.y + ray.z * ray.z;
	float b = ray.x * (origin.x - sphere.center.x) + ray.y * (origin.y - sphere.center.y) + ray.z * (origin.z - sphere.center.z);
	float c = (origin.x - sphere.center.x) * (origin.x - sphere.center.x) + (origin.y - sphere.center.y) * (origin.y - sphere.center.y) + (origin.z - sphere.center.z) * (origin.z - sphere.center.z) - sphere.radius * sphere.radius;
	
	if (b*b - a*c > 0.0) {
		float D = sqrt(b*b - a*c);
		float t = min((-b+D)/a, (-b-D)/a);
		vec3 p = origin + t * ray;
		return Intersection(true, t, p, normalize(p - sphere.center));
	} else {
		return Intersection(false, 0.0, vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0));
	}
}

float shade(Intersection hit, Light light) {
	
	float r_sq = (hit.position.x - light.position.x) * (hit.position.x - light.position.x) + (hit.position.y - light.position.y) * (hit.position.y - light.position.y) + (hit.position.z - light.position.z) * (hit.position.z - light.position.z);
	float e = light.strength * (hit.normal.x * light.position.x + hit.normal.y * light.position.y + hit.normal.z * light.position.z) / (4.0 * M_PI * r_sq);
	return e;
}

void main( void ) {

	vec3 c_up = vec3(0.0, 1.0, 0.0);
	vec3 c_from = vec3(0.0, 0.0, 0.0);
	vec3 c_to = vec3(0.0, 0.0, -1.0);
	
	// Light Source
	Light light = Light(vec3(0.0, 0.0, 10.0), 300.0);
	
	// Objects
	Sphere objects[OBJECT_NUM];
	objects[0] = Sphere(3.0, vec3(0.0, 0.0, -8.0) + vec3(mouse, 0.0));
	objects[1] = Sphere(5.0, vec3(0.0, 3.0, -12.0));
	
	// Pixel Position
	vec2 pixel = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// Ray
	vec3 ray = generate_camera_ray(pixel, c_from);
	
	// Hit
	Intersection hit;
	for (int i=0; i<OBJECT_NUM; i++) {
		Intersection tmp = intersect(ray, c_from, objects[i]);
		
		if (hit.exists) {
			if (tmp.exists && (hit.dist > tmp.dist)) {
				hit = tmp;
			}
		} else {
			hit = tmp;
		}
	}
	
	// Shade
	if (hit.exists) {
		float e = shade(hit, light);
		gl_FragColor = vec4(e, e, e, 1);
	}
	
}