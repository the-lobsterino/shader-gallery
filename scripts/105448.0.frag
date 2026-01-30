#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979325385

struct ray
{
	vec3 origin, direction;
};

struct camera
{
	vec3 origin, horizontal, vertical, llc;
};

struct hitRecord
{
	vec3 p, normal;
	float t;
	bool frontFace;
	
};

struct sphere
{
	vec3 center;
	float r;
};

float deg2rad(float deg);
float lengthSqrd(vec3 v);
vec3 rayAt(ray r, float t);
vec3 unitVec(vec3 v);
camera makeCamera();
ray cameraGetRay(camera c, vec2 uv);
void rayColor(in ray r, out vec3 o);
bool raycast(const in ray r, inout hitRecord hit);
bool hitSphere(sphere s, ray r, inout hitRecord hit);
bool hit(ray r, float tMin, float tMax, hitRecord rec);
void setFaceNormal(ray r, vec3 outwardNormal, hitRecord rec);
float random();
float random(float min, float max);

void main( void ) 
{
	
	//Image
	float ar = 16.0 / 9.0;
	int iWidth = int(resolution.x);
	int iHeight = int(float(iWidth)/ar);
	
	//Render
    float u = gl_FragCoord.x / (float(iWidth) - 1.0);
    float v = gl_FragCoord.y / (float(iHeight) - 1.0);
			
	camera c = makeCamera();
	ray r = cameraGetRay(c, vec2(u, v));
	
    vec3 color;
	rayColor(r, color);

	//output the color
    gl_FragColor = vec4(color,1.);
}

float lengthSqrd(vec3 v)
{
	return (v.x * v.x) + (v.y * v.y) + (v.z * v.z);
}

	
vec3 rayAt(ray r, float t)
{
	return r.origin + t * r.direction;
}


vec3 unitVec(vec3 v)
{
	return v / length(v);
}
	
camera makeCamera()
{
	float height = 2.0;
	float ar = 16.0 / 9.0;
	float width = ar * height;
	float focalLength = 1.0;
	
	vec3 origin = vec3(0,0,0.);
	vec3 horizontal = vec3(width, 0., 0.);
	vec3 vertical = vec3(0., height, 0.);
	vec3 llc = origin - horizontal/2. - vertical/2. - vec3(0., 0., focalLength);
	//vec3 llc = vec3(-2., -1., -1.);

	return camera(origin, horizontal, vertical, llc);
}

ray cameraGetRay(camera c, vec2 uv)
{
	ray r = ray(c.origin, normalize(c.llc + uv.x * c.horizontal + uv.y * c.vertical - c.origin));
	return r;
}

void rayColor(in ray r, out vec3 o)
{
	hitRecord hit;
	
	float t = 0.0;
	bool isHit = raycast(r, hit);
	
	if(isHit)
	{
		o = 0.5 * (hit.normal + vec3(1.));
		return;
	}
	
	vec3 unitDirection = unitVec(r.direction);
	t = 0.5 * (unitDirection.y + 1.0);
	o = (1.0 - t) * vec3(1.0) + t * vec3(0.5, 0.7, 1.0);
}

bool hitSphere(sphere s, ray r, inout hitRecord hit)
{
	vec3 oc = r.origin - s.center;
	float a = lengthSqrd(r.direction);
	float halfb = dot(oc, r.direction);
	float c = lengthSqrd(oc) - s.r * s.r;
	float discriminant = halfb * halfb - a * c;
	if(discriminant < 0.) return false;
	
	float sqrtd = sqrt(discriminant);
	float tMin = -halfb - sqrtd;
	float tMax = -halfb + sqrtd;
	
	float t = tMin < 0.05 ? tMax : tMin;

	vec3 p = rayAt(r, t);
	vec3 normal = (p - s.center);
	
	bool frontFace = dot(r.direction, normal) > 0.;

	normal = frontFace ? -normal : normal;
	normal /= s.r;

	if (t < 0.05 || t > 1000.)
	{
		return false;
	}

	hit = hitRecord(p, normal, t, frontFace);
	return true;
}

bool hit(ray r, float tMin, float tMax, hitRecord rec)
{
	return true;
}

void setFaceNormal(ray r, vec3 outwardNormal, hitRecord rec)
{
	rec.frontFace = dot(r.direction, outwardNormal) < 0.0;
	rec.normal = rec.frontFace ? outwardNormal : -outwardNormal;
}

float deg2rad(float deg)
{
	return deg * PI / 180.0;
}

bool raycast(const in ray r, inout hitRecord hit)
{
	//List objects here
	sphere s = sphere(vec3(0,0,-1), 0.5);
	sphere s2 = sphere(vec3(0, -100.5, -1), 100.0);
	
	bool isHit = false;
	//check for hits here
	isHit = hitSphere(s2, r, hit) || isHit;
	isHit = hitSphere(s, r, hit) || isHit;
	return isHit;
}

float random()
{
	vec2 seed = vec2(gl_FragCoord.x,gl_FragCoord.y);
	vec2 K1 = vec2(23.14069263277926, 2.665144142690225);
	return fract(cos(dot(seed, K1)) * 12345.6789);
}

float random(float min, float max)
{
	return min + (max-min)*random();
}