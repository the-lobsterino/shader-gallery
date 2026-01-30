#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// Structure
struct Ray {
	vec3 origin;
	vec3 direction;
	
};
	
struct Sphere {
	float radius;
	vec3 position;
	vec3 color;
};
	
struct Plane {
	vec3 position;
	vec3 normal;
	vec3 color;
};

struct Intersection {
	int hit;
	vec3 hitPoint;
	vec3 normal;
	vec3 color;
	float distance;
	vec3 rayDir;
};

const vec3 LDR = vec3(0.577);
const float EPS = 0.0001;
const int MAX_REF = 4;

Sphere sphere[3];
Plane plane;

void intersectInit(inout Intersection I) {
	I.hit = 0;
	I.hitPoint = vec3(0.0);
	I.normal = vec3(0.0);
	I.color = vec3(0.0);
	I.distance = 1.0e+30;
	I.rayDir = vec3(0.0);
}

void intersectSphere(Ray ray, Sphere sphere, inout Intersection I) {
	vec3 a = ray.origin - sphere.position;
	float b = dot(a, ray.direction);
	float c = dot(a, a) - (sphere.radius * sphere.radius);
	float d = b * b - c;
	float t = -b - sqrt(d);
	if (d > 0.0 && t > EPS && t < I.distance) {
		I.hitPoint = ray.origin + ray.direction * t;
		I.normal = normalize(I.hitPoint - sphere.position);
		d = clamp(dot(LDR, I.normal), 0.1, 1.0);
		I.color = sphere.color * d;
		I.distance = t;
		I.hit++;
		I.rayDir = ray.direction;
	}
}

void intersectPlane(Ray ray, Plane plane, inout Intersection I) {
	float d = -dot(plane.position, plane.normal);
	float v = dot(ray.direction, plane.normal);
	float t = -(dot(ray.origin, plane.normal) + d) / v;
	if (t > EPS && t < I.distance) {
		I.hitPoint = ray.origin + ray.direction * t;
		I.normal = plane.normal;
		float d = clamp(dot(LDR, I.normal), 0.1, 1.0);
		float m = mod(I.hitPoint.x, 2.0);
		float n = mod(I.hitPoint.z, 2.0);
		if ((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)) {
			d *= 0.5;
		}
		float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
		I.color = plane.color * d * f;
		I.distance = t;
		I.hit++;
		I.rayDir = ray.direction;
	}
}

void intersectExec(Ray ray, inout Intersection I) {
	intersectSphere(ray, sphere[0], I);
	intersectSphere(ray, sphere[1], I);
	intersectSphere(ray, sphere[2], I);
	intersectPlane(ray, plane, I);
}
	
void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	Ray ray;
	ray.origin = vec3(0.0, 2.0, 6.0);
	ray.direction = normalize(vec3(p.x, p.y, -1.0));
	
	sphere[0].radius = 0.5;
	sphere[0].position = vec3(0.0, -0.5, 0);
	sphere[0].color = vec3(1.0, 0.0, 0.0);
	sphere[1].radius = 1.0;
	sphere[1].position = vec3(2.0, 0.0, 0);
	sphere[1].color = vec3(0.0, 1.0, 0.0);
	sphere[2].radius = 1.5;
	sphere[2].position = vec3(-2.0, 0.5, 0);
	sphere[2].color = vec3(0.0, 0.0, 1.0);
	
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0);
	
	Intersection its;
	intersectInit(its);
	
	vec3 destColor = vec3(ray.direction.y);
	vec3 tempColor = vec3(1.0);
	Ray q;
	intersectExec(ray, its);
	if (its.hit > 0) {
		destColor = its.color;
		tempColor *= its.color;
		for (int j = 1; j < MAX_REF; j++) {
			q.origin = its.hitPoint + its.normal * EPS;
			q.direction = reflect(its.rayDir, its.normal);
			intersectExec(q, its);
			if (its.hit > j) {
				destColor += tempColor * its.color;
				tempColor *= its.color;
			}
		}
	}
	gl_FragColor = vec4(destColor, 1.0);
}