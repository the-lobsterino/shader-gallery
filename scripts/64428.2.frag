#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

struct Ray{
	vec3 origin;
	vec3 direction;
};
	
struct Sphere{
    	float radius;
    	vec3  center;
    	vec3  color;	
};

struct Plane{
    	vec3 position;
    	vec3 normal;
    	vec3 color;
};

struct Intersect{
    	bool hit;
    	vec3 hitpoint;
    	vec3 normal;
    	vec3 color; 
	float distance;
};

void intersectSphere(Ray R, Sphere S, inout Intersect I){
    	vec3  a = R.origin - S.center;
    	float b = dot(a, R.direction);
    	float c = dot(a, a) - (S.radius * S.radius);
    	float d = dot(R.direction, R.direction);
    	float e = b * b - d * c;
	float t = (-b - sqrt(e))/d;
    	if(e > 0.0 && t > 0.0 && t < I.distance){
		I.hit = true;
		I.hitpoint = R.origin + t * R.direction;
		I.normal = normalize(I.hitpoint - S.center);
		float f = clamp(dot(normalize(vec3(1.0)), I.normal), 0.1, 1.0);
		I.color = S.color * f;
		I.distance = t;
			
	}
}

void intersectPlane(Ray R, Plane P, inout Intersect I){
	
	float d = dot(R.origin, P.normal);
    	float v = dot(R.direction, P.normal);
    	float t = 0.0;
        if(v != 0.0){
		t = -d/v;
        }
	
	if(t > 0.0 && t < I.distance){
		I.hit = true;
		I.hitpoint = R.origin + t * R.direction;
		I.normal = P.normal;
		float d = clamp(dot(normalize(vec3(1.0)), I.normal), 0.1, 1.0);
        	float m = mod(I.hitpoint.x, 2.0);
        	float n = mod(I.hitpoint.z, 2.0);
        	if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
            		d *= 0.5;
        	}
        	I.color = P.color * d;
		I.distance = t;
	}
    	
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	Ray ray;
	
	ray.origin = vec3(0.0, 3.5, 10.5);
	ray.direction = normalize(vec3(position.x, position.y, -1.0));
	
	Intersect I;
	I.hit = false;
    	I.hitpoint = vec3(0.0);
    	I.normal = vec3(0.0);
    	I.color = vec3(0.0);
	I.distance = 1.0e+30;
	
	Sphere sphere;
    	sphere.radius = 1.5;
    	sphere.center = vec3(3.5 * sin(time), 1.5, 3.5 * cos(time));
    	sphere.color = vec3(3.0, 1.0, 2.0);
	
	Sphere sphere1;
    	sphere1.radius = 2.0;
    	sphere1.center = vec3(0, 2.0, 0);
    	sphere1.color = vec3(0.5, 2.0, 3.0);
	
	vec3 a = sphere1.center - vec3(mouse.x * 10.5 - 5.25,  mouse.y * 10.5 - 2.5, 0.5);
	float radius = sphere.radius;
    	if (dot(a, a) < radius * radius && sphere1.color.x == 0.5) {
        	sphere1.color = vec3(3.0, 1.0, 0.0);
    	}
	
	Plane plane;
    	plane.position = vec3(0.0, 0.0, 2.0);
    	plane.normal = vec3(0.0, 1.0, 0.0);
    	plane.color = vec3(2.0, 3.0, 0.0);
	
	intersectSphere(ray, sphere, I);
	intersectSphere(ray, sphere1, I);
    	intersectPlane(ray, plane, I);
	
	
	
	gl_FragColor = vec4(I.color, 1.0);
}