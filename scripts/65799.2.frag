#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));

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
	vec3 hitpoint;
	vec3 normal;
	vec3 color;
};

void intersectSphere(Ray R, Sphere S, inout Intersection I) {
	float a = dot(R.direction, R.direction);
	float b = 2.0*dot(R.direction, R.origin-S.position);
	float c = dot(R.origin-S.position, R.origin-S.position)-S.radius*S.radius;
	float D = b*b-4.0*a*c;
	if (D >= 0.0) {
		float t = (-b-sqrt(D))/(2.0*a);
		if (t >= 0.0) {
			I.hitpoint = R.origin+t*R.direction;
			I.normal = normalize(R.origin+t*R.direction-S.position);
			float d = clamp(dot(I.normal, lightDirection), 0.1, 1.0);
			I.color = d*S.color;
		}
	}
}

void intersectPlane(Ray R, Plane P, inout Intersection I) {
	if (dot(R.direction, P.normal) != 0.0) {
		float t = dot(P.position-R.origin, P.normal)/dot(R.direction, P.normal);
		if (t >= 0.0) {
			I.hitpoint = R.origin+t*R.direction;
			float mod_x = mod(I.hitpoint.x, 2.0);
			float mod_z = mod(I.hitpoint.z, 2.0);
			I.normal = P.normal;
			float d = clamp(dot(I.normal, lightDirection), 0.1, 1.0);
			float f = 1.0 - min(abs(I.hitpoint.z), 25.0) * 0.04;
			//float f = 1.0;
			if ((mod_x > 1.0 && mod_z > 1.0) || (mod_x < 1.0 && mod_z < 1.0)) {
				d *= 0.5;
			}
			I.color = f*d*P.color;
		}
		
	}
	
}
	
	
void main( void ) {
	vec2 position = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x, resolution.y);
	
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 6.0);
	ray.direction = vec3(position.x, position.y, -1.0);
	
	//Sphere sphere;
	//sphere.position = vec3(0.0);
	//sphere.radius = 1.0;
	//sphere.color = vec3(1.0);
	
	float t = time;
    Sphere sphere[3];
    sphere[0].radius = 0.5;
    sphere[0].position = vec3(0.0, -0.5, sin(t));
    sphere[0].color = vec3(1.0, 0.0, 0.0);
    sphere[1].radius = 1.0;
    sphere[1].position = vec3(2.0, 0.0, cos(t * 0.666));
    sphere[1].color = vec3(0.0, 1.0, 0.0);
    sphere[2].radius = 1.5;
    sphere[2].position = vec3(-2.0, 0.5, cos(t * 0.333));
    sphere[2].color = vec3(0.0, 0.0, 1.0);	

	
	Plane plane;
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0);
	
	Intersection intersect;
	intersect.hitpoint = vec3(0.0);
	intersect.normal = vec3(0.0);
	intersect.color = vec3(0.0);

	intersectPlane(ray, plane, intersect);
	//intersectSphere(ray, sphere, intersect)
	intersectSphere(ray, sphere[0], intersect);
	intersectSphere(ray, sphere[1], intersect);
	intersectSphere(ray, sphere[2], intersect);
	//intersectPlane(ray, plane, intersect);
	gl_FragColor = vec4(intersect.color, 1.0);
}