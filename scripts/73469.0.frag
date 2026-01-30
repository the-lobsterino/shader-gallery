#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define M_PI 3.14159265358979323846

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct Sphere {
	float radius;
	vec3 center;
};
	
struct Intersection {
	bool exists;
	float t;
	vec3 position;
	vec3 normal;
};

struct Light {
	vec3 origin;
	float intensity;
};

// Horizontal
struct Plane {
	float y;
};
	
// Only consider t > 0 cases
Intersection intersectionWithSphere(vec3 ray, Sphere s, vec3 origin) {
	float a = dot(ray, ray);
	float b = dot(ray, origin - s.center);
	float c = dot(origin - s.center, origin - s.center) - s.radius * s.radius;
	float inSqrt = b * b - a * c;
	if(inSqrt < 0.) {
		return Intersection(false, 0., vec3(0), vec3(0));
	}
	float t = (- b - sqrt(b * b - a * c))/ a;
	vec3 p = t * ray;
	return Intersection(true, t, p, normalize(p - s.center));
}

Intersection intersectionWithPlane(vec3 ray, Plane p) {
	if(ray.y == 0.) return Intersection(false, 0., vec3(0), vec3(0));
	float t = p.y / ray.y;
	if(t < 0.) return Intersection(false, 0., vec3(0), vec3(0));
	return Intersection(true, t, t * ray, vec3(0., -1., 0.));
}

vec3 shade(Light l, Intersection i) {
	vec3 ll = l.origin + i.position;
	float r = length(l.origin - i.position);
	return vec3(1.0) * l.intensity * dot(i.normal, ll) / (4. * M_PI * r * r);
}
	
const float filmW = 10.;
const float filmH = 10.;
const float filmDistance = 10.;

vec3 generateRay(vec2 pixel) {
	return vec3(- filmW * pixel.x, - filmH * pixel.y,  -filmDistance);
}

void main( void ) {
	vec2 pixel = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	
	vec3 color = vec3(0.);

	// Use (0, 0, 0) as the origin in all functions
	vec3 from = vec3(0., 0., 0.);
	vec3 to = vec3(0., 0., -1.);
	vec3 up = vec3(0., 1., 0.);
	
	vec3 ray = generateRay(pixel);
	
	Sphere s = Sphere(3., vec3(0., 1., -8.0));
	Plane p = Plane(5.);
	Intersection i = intersectionWithSphere(ray, s, from);
	//Light l = Light(vec3(cos(time) * 10., sin(time) * 10. - 20., 20.0), 500.0); 
	Light l = Light(vec3(0., - 20., 20.0), 500.0); 
	if(i.exists) {
		color = shade(l, i);
	} else {
		Intersection ip = intersectionWithPlane(ray, p);
		if(ip.exists) {
			vec3 light_dir = normalize(ip.position - l.origin);
			Intersection sphereLight = intersectionWithSphere(light_dir, s, l.origin);
			if(sphereLight.exists) color = 0.1 * shade(l, ip);
			else color = shade(l, ip);
		}
	}
	
	gl_FragColor = vec4( color, 1.0 );

}