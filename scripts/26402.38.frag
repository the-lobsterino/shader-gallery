#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray
{
	vec3 origin;
	vec3 direction;
};

struct Sphere
{
	float radius;
	vec3 center;
	vec3 color;
};

struct Plane
{
	vec3 position;
	vec3 normal;
	vec3 color;
};

struct Triangle
{
	vec3 a;
	vec3 b;
	vec3 c;
	vec3 color;
};

struct RaycastHit
{
	bool hit;
	vec3 point;
	vec3 normal;
	vec3 color;
	float distance;
	vec3 raydir;
};

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

const float PI = 3.14159265359;
const float EPSILON = 0.0001;

void intersectInit(inout RaycastHit ray)
{
	ray.hit = false;
	ray.point = vec3(0.0);
	ray.normal = vec3(0.0);
	ray.color = vec3(0.0);
	ray.distance = 1.0e+30;
	ray.raydir = vec3(0.0);
}

void intersect(Ray ray, Sphere sphere, inout RaycastHit hitInfo)
{
	vec3 a = ray.origin - sphere.center;
	float b = dot(a, ray.direction);
	float c = dot(a, a) - sphere.radius * sphere.radius;
	float d = b * b - c;
	float t = -b-sqrt(d);
	
	if(d>0.0 && t>EPSILON && t<hitInfo.distance)
	{
		hitInfo.hit = true;
		hitInfo.point = ray.origin + ray.direction * t;
		hitInfo.normal = normalize(hitInfo.point - sphere.center);
		hitInfo.color = sphere.color;
		hitInfo.distance = t;
		hitInfo.raydir = ray.direction;
	}
}	

void intersect(Ray ray, Plane plane, inout RaycastHit hitInfo)
{
	float d = -dot(plane.position, plane.normal);
	float v = dot(ray.direction, plane.normal);
	float t = -(dot(ray.origin, plane.normal) + d)/v;
	
	if(t>EPSILON && t<hitInfo.distance)
	{
		hitInfo.hit = true;
		hitInfo.point = ray.origin + ray.direction * t;
		hitInfo.normal = plane.normal;
		hitInfo.color = plane.color;
		hitInfo.distance = t;
		hitInfo.raydir = ray.direction;
	}
}

void intersect(Ray ray, Triangle triangle, inout RaycastHit hitInfo)
{
	vec3 ab = triangle.a - triangle.b;
	vec3 ac = triangle.a - triangle.c;
	vec3 ao = triangle.a - ray.origin;

	float detA = dot(cross(ab,ac), ray.direction); 
	if(detA == 0.0) {
		return;
	}
	
	float beta  = dot(cross(ao, ac), ray.direction)/detA;
	float gamma = dot(cross(ab, ao), ray.direction)/detA;
	float t     = dot(cross(ab, ac), ao)/detA;
	
	if(t>0.0 && t<hitInfo.distance && beta>0.0 && beta<1.0 && gamma>0.0 && gamma<1.0 && beta+gamma<1.0)
	{
		hitInfo.hit = true;
		hitInfo.point = ray.origin + ray.direction * t;
		hitInfo.normal = normalize(cross(ab, ac));
		hitInfo.color = triangle.color;
		hitInfo.distance = t;
		hitInfo.raydir = ray.direction;
	}
}

const int MAX_RAY_DEPTH = 6;

DirectionalLight light;
Plane plane;
Sphere sphere1;
Sphere sphere2;
Sphere sphere3;
Triangle triangle;

void intersectSet(Ray ray, inout RaycastHit hitInfo)
{
	intersect(ray, plane, hitInfo);
	intersect(ray, sphere1, hitInfo);
	intersect(ray, sphere2, hitInfo);
	intersect(ray, sphere3, hitInfo);
	intersect(ray, triangle, hitInfo);
}

bool traceShadowRay(Ray ray)
{
	RaycastHit hitInfo;
	intersectInit(hitInfo);
	intersectSet(ray, hitInfo);
	
	return hitInfo.hit;
}

vec3 Shading(vec3 normal, vec3 color)
{
	float NdotL = max(0.0, dot(normal, light.direction));
	vec3 diffuse = NdotL * color * light.color;
	
	vec3 H = normalize(light.direction + vec3(0.0, 0.0, 1.0));
	float NdotH = max(0.0, dot(normal, H));
	vec3 specular = pow(NdotH, 50.0) * light.color * 0.8;
	
	return diffuse + specular;
}

void main()
{
	light.direction = normalize(vec3(0.6, 0.6, 0.6));
	light.color = vec3(0.8, 0.8, 0.8);
	
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0, 1.0, 0.0);
	
	sphere1.radius = 1.0;
	sphere1.center = vec3(0.0, 0.0, -5.0);
	sphere1.color = vec3(1.0, 0.0, 0.0);
	
	sphere2.radius = 1.0;
	sphere2.center = vec3(1.5, 0.0, -7.0);
	sphere2.color = vec3(0.0, 1.0, 0.0);
	
	sphere3.radius = 1.0;
	sphere3.center = vec3(-1.5, 0.0, -7.0);
	sphere3.color = vec3(0.0, 0.0, 1.0);
	
	triangle.a = vec3(0.0, 4.0, -7.0);
	triangle.b = vec3(cos(time), 3.0, -sin(time)-7.0);
	triangle.c = vec3(-cos(time), 3.0, sin(time)-7.0);
	triangle.color = vec3(1.0, 1.0, 1.0);
	
	vec3 destColor = vec3(0.2, 0.2, 0.2);
	vec3 tempColor = vec3(1.0);

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy)/resolution.y;
	
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 0.0);
	ray.direction = normalize(vec3(vec2(position), -1.0));
	
	RaycastHit hitInfo;
	intersectInit(hitInfo);
	intersectSet(ray, hitInfo);
	if(hitInfo.hit)
	{
		vec3 color = Shading(hitInfo.normal, hitInfo.color);
		destColor = color;
		tempColor *= color;
		
		Ray shadowRay;
		shadowRay.origin = hitInfo.point + hitInfo.normal*EPSILON;
		shadowRay.direction = light.direction;
		if(traceShadowRay(shadowRay))
		{
			destColor = vec3(0.0);
		}
		
		/*for(int i=1; i<MAX_RAY_DEPTH; ++i)
		{
			Ray r;
			r.origin = hitInfo.point + hitInfo.normal*EPSILON;
			r.direction = reflect(hitInfo.raydir, hitInfo.normal);
			
			intersectInit(hitInfo);
			intersectSet(r, hitInfo);
			if(hitInfo.hit)
			{
				vec3 color = Shading(hitInfo.normal, hitInfo.color);
				destColor += tempColor * color;
				tempColor *= color;
			}
		}*/
	}
	
	gl_FragColor = vec4(destColor, 1.0);
}
