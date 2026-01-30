#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 cameraPosition = vec3(0.0, 1.0, 3.0);
vec3 lightDirection = vec3(1.0);

float EPS = 1e-5;

struct Ray{
	vec3 origin;
	vec3 direction;
};

struct Hit {
	int count;
	vec3 position;
	vec3 normal;
	vec3 color;
	float dist;
	vec3 rayDirection;
};		

struct Sphere{
	float radius;
	vec3  position;
	vec3  color;
};
void intersectSphere(Ray R, Sphere S, inout Hit hit) {
	vec3  a = R.origin - S.position;
	float b = dot(a, R.direction);
	float c = dot(a, a) - (S.radius * S.radius);
	float d = b * b - c;
	if(d > 0.0) {
		float t = -b - sqrt(d);
		if(t > EPS && t < hit.dist){
			if(t > 0.0) hit.count++;
			hit.dist = t;
			hit.position = R.origin + R.direction * t;
			hit.normal = normalize(hit.position - S.position);
			float diff = clamp(dot(normalize(lightDirection), hit.normal), 0.1, 1.0);
            		hit.color = S.color * diff;
			hit.rayDirection = R.direction;
		}
	}
}

struct Triangle {
	vec3 origin;
	vec3 edge1;
	vec3 edge2;
	vec3 color;
};

float det(vec3 a, vec3 b, vec3 c) {
	return (a.x * b.y * c.z)
		+ (a.y * b.z * c.x)
		+ (a.z * b.x * c.y)
		- (a.x * b.z * c.y)
		- (a.y * b.x * c.z)
		- (a.z * b.y * c.x);
}

void intersectTriangle(Ray R, Triangle T, inout Hit hit) {
	vec3 invRay = -1.0 * R.direction;
	vec3 e1 = T.edge1;
	vec3 e2 = T.edge2;

	float denominator =  det(e1, e2, invRay );
	if ( denominator == 0.0 ) return;

	float invDenominator = 1.0 / denominator;
	vec3 d = R.origin - T.origin;

	float u = det(d, e2, invRay ) * invDenominator;
	if (u < 0.0 || u > 1.0) return;

	float v = det( e1, d, invRay ) * invDenominator;
	if (v < 0.0 || u + v > 1.0) return;

	float t = det(e1, e2, d) * invDenominator;
	if(t > EPS && t < hit.dist) {
		hit.count++;
		hit.position = R.origin + R.direction * t;
		hit.dist = t;
		hit.normal   = normalize(cross(e1, e2)) * sign(invDenominator);
        	hit.color = T.color * clamp(dot(normalize(lightDirection), hit.normal), 0.1, 1.0);
		hit.rayDirection = R.direction;
	}
}

struct Plane{
	vec3 position;
	vec3 normal;
	vec3 color;
};

void intersectPlane(Ray R, Plane p, inout Hit hit){
	float d = -dot(p.position, p.normal);
	float v = dot(R.direction, p.normal);
	float t = -(dot(R.origin, p.normal) + d) / v;
	if(t > EPS && t < hit.dist){
		hit.count++;
		hit.dist = t;
		hit.position = hit.position = R.origin + R.direction * t;
		hit.normal = p.normal;
		float diff = clamp(dot(hit.normal, lightDirection), 0.1, 1.0);
		float m = mod(hit.position.x, 2.0);
		float n = mod(hit.position.z, 2.0);
		if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
			diff *= 0.5;
		}
		
		float f = 1.0 - min(abs(hit.position.z), 25.0) * 0.04;
		hit.color = p.color * diff * f;
		hit.rayDirection = R.direction;
	}
}
Triangle triangle[2];
Sphere sphere[2];
Plane plane;

void checkHit(Ray ray, inout Hit hit) {
	for(int i=0; i<2; i++) {
		intersectSphere(ray, sphere[i], hit);
	}
	for(int i=0; i<2; i++) {
		intersectTriangle(ray, triangle[i], hit);
	}
	intersectPlane(ray, plane, hit);
}

void main(void){
	// fragment position
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// ray init
	Ray ray;
	ray.origin = cameraPosition;
	ray.direction = normalize(vec3(pos.x, pos.y, -1.0));
	
	// triangle init
	triangle[0].color = vec3(0.1, 1.0, 0.1);
	triangle[0].origin = vec3(1.0, 0.5, 0.0);
	triangle[0].edge1 = vec3(1.0*cos(time), 0.0, sin(time));
	triangle[0].edge2 = vec3(0.0, 1.0, 0.0);
	
	triangle[1].color = vec3(1.0, 0.1, 0.1);
	triangle[1].origin = vec3(-1.0, 0.5, 0.0);
	triangle[1].edge1 = vec3(-1.0*cos(time), 0.0, sin(time));
	triangle[1].edge2 = vec3(0.0, 1.0, 0.0);

	// sphere init
	sphere[0].radius = 0.5;
	sphere[0].position = vec3(1.0, 0.5, 0.0);
	sphere[0].color = vec3(0.0, 1.0, 0.0);
	
	sphere[1].radius = 0.5;
	sphere[1].position = vec3(-1.0, 0.5, 0.0);
	sphere[1].color = vec3(1.0, 0.0, 0.0);

	plane.position = vec3(0.0, -0.2, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(0.6, 0.9, 1.0);

	Hit hit;
	hit.count = 0;
	hit.dist = 1e+30;
	
	vec3 tempColor = vec3(1.0);
	checkHit(ray, hit);
	vec3 pixel = vec3(ray.direction.y);
	if(hit.count > 0) {
		pixel = hit.color;
		tempColor = hit.color;
		Ray ray2;
		for(int reflection=1; reflection < 2; reflection++) {
			ray2.direction = reflect(hit.rayDirection, hit.normal);
			ray2.origin = hit.position + ray2.direction * EPS;
			checkHit(ray2, hit);
			if(hit.count > reflection) {
				pixel += tempColor * hit.color;
				tempColor *= hit.color;
			}
		}
	}
	gl_FragColor = vec4(pixel, 1.0);
}