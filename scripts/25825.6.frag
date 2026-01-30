#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray{
	vec3 origin;
	vec3 direction;
};
	
struct Sphere{
	float radius;
	vec3 center;
	vec3 color;
};
	
struct Plane{
	vec3 position;
	vec3 normal;
	vec3 color;
};
	
struct Intersection{
	int hit;
	vec3 point;
	vec3 normal;
	vec3 color;
	float distance;
	vec3 raydir;
};
	
const vec3 lightDirection = vec3(0.577);
const float EPS = 0.0001;
const int MAX_REF = 5;

Sphere sphere[2];
Plane plane;

void intersectInit(inout Intersection i){
	i.hit = 0;
	i.point = vec3(0.0);
	i.normal = vec3(0.0);
	i.color = vec3(0.0);
	i.distance = 1.0e+30;
	i.raydir = vec3(0.0);
}
	
void intersectSphere(Ray R, Sphere S, inout Intersection i){
	vec3 a = R.origin - S.center;
	float b = dot(a, R.direction);
	float c = dot(a, a) - S.radius * S.radius;
	float d = b * b - c;
	float t = -b -sqrt(d);
	if(d > 0.0 && t > EPS && t < i.distance){
		i.point = R.origin + R.direction * t;
		i.normal = normalize(i.point - S.center);
		float d = clamp(dot(lightDirection, i.normal), 0.1, 1.0);
		i.color = S.color * d;
		i.distance = t;
		i.hit++;
		i.raydir = R.direction;
	}
}	

void intersectPlane(Ray R, Plane P, inout Intersection i){
	float d = -dot(P.position, P.normal);
	float v = dot(R.direction, P.normal);
	float t = -(dot(R.origin, P.normal) + d) / v;
	if(t > EPS && t < i.distance){
		i.point = R.origin + R.direction * t;
		i.normal = P.normal;
		float d = clamp(dot(lightDirection, i.normal), 0.1, 1.0);
		float m = mod(i.point.x, 2.0);
		float n = mod(i.point.z, 2.0);
		if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
			d *= 0.5;
		}
		float f = 1.0 - min(abs(i.point.z), 25.0) * 0.04;
		i.color = P.color * d * f;
		i.distance = t;
		i.hit++;
		i.raydir = R.direction;
	}
}

void intersectSet(Ray R, inout Intersection i){
	intersectSphere(R, sphere[0], i);
	intersectSphere(R, sphere[1], i);
	intersectPlane(R, plane, i);
}
	
void main( void ) {

	vec2 position = ( gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	
	//ray
	Ray ray;
	ray.origin = vec3(0.0, 2.0, 6.0);
	ray.direction = normalize(vec3(vec2(position), -1.0));
	
	//sphere
	sphere[0].radius = 1.0;
	sphere[0].center = vec3(2.0, 0.0, cos(time * 0.666));
	sphere[0].color = vec3(1.0, 0.0, 0.0);
	sphere[1].radius = 1.5;
	sphere[1].center = vec3(-2.0, 0.5, cos(time * 0.333));
	sphere[1].color = vec3(0.0, 0.0, 1.0);
	
	//plane
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0);
	
	//intersection
	Intersection i;
	intersectInit(i);

	//check hit or not
	vec3 destColor = vec3(ray.direction.y);
	vec3 tempColor = vec3(1.0);
	Ray q;
	intersectSet(ray, i);
	if(i.hit > 0){
		destColor = i.color;
		tempColor *= i.color;
		for(int j = 1; j < MAX_REF; j++){
			q.origin = i.point + i.normal * EPS;
			q.direction = reflect(i.raydir, i.normal);
			intersectSet(q, i);
			if(i.hit > j){
				destColor += tempColor * i.color;
				tempColor *= i.color;
			}
		}
	}
	gl_FragColor = vec4(destColor, 1.0);

}