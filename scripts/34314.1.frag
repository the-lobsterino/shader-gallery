#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define NUM 4

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 cameraPos = vec3(0.,0.,-2.);
vec3 lightPos = vec3(0.,5.,0.);

struct Ray {
	vec3 origin;
	vec3 direction;
};

struct Sphere {
	vec3 center;
	float radius;
	vec3 color;
};

struct Hit {
	bool hit;
	vec3 pos;
	vec3 normal;
	Sphere obj;
};

Ray generateCameraRay(vec3 pos)
{
	Ray ray;
	ray.origin = cameraPos;
	ray.direction = normalize(pos - cameraPos);
	return ray;
}	

Hit rayCastHit(in Ray ray, in Sphere spheres[NUM])
{
	Hit hit;
	hit.hit = false;
	float min_t = 1000000.;
	for (int i = 0; i < NUM; i++) {
		vec3 distance = ray.origin-spheres[i].center;
		float a = dot(ray.direction, ray.direction);
		float b = 2. * dot(ray.direction, distance);
		float c = dot(distance, distance) - spheres[i].radius*spheres[i].radius;
		if ((b*b-4.*a*c) >= 0.) {
			float t = (-b-sqrt(b*b-4.*a*c))/2./a;
			if (t > 0. && t < min_t) {
				min_t = t;
				hit.hit = true;
				hit.obj = spheres[i];
			}
		}
	}
	hit.pos = ray.origin+ray.direction*min_t;
	hit.normal = normalize(hit.pos-hit.obj.center);
	return hit;
}

vec4 shade(in Hit hit, in Sphere spheres[NUM])
{
	Ray lightRay;
	lightRay.origin = lightPos;
	lightRay.direction = hit.pos - lightPos;
	Hit lightHit = rayCastHit(lightRay, spheres);
	vec3 diff = lightHit.pos - hit.pos;
	if (dot(diff, diff) > 0.001) {
		return vec4(vec3(0.,0.,0.),1.);
	} else {
		float e = 2000.*dot(normalize(lightPos-hit.pos),hit.normal) / (4.*3.14*dot(lightPos-hit.pos,lightPos-hit.pos));
		return vec4(hit.obj.color*e,1.);
	}
}

void main(void)
{
	Sphere spheres[NUM];
	spheres[0].center = vec3(0.,0.,10.);
	spheres[0].radius = 1.;
	spheres[0].color = vec3(1.,0.2,0.2);
	spheres[1].center = vec3(5.,5.,30.);
	spheres[1].radius = 2.;
	spheres[1].color = vec3(0.2,1.,0.2);
	spheres[2].center = vec3(-2.,0.,20.);
	spheres[2].radius = 1.5;
	spheres[2].color = vec3(0.,0.8,0.8);
	spheres[3].center = vec3(-2.,-18.,30.);
	spheres[3].radius = 15.;
	spheres[3].color = vec3(1.,1,0.2);
	
	
	vec2 pixel = (gl_FragCoord.xy - resolution * 0.5)  / resolution.y + mouse - 0.5;
	vec3 pos = vec3(pixel, 0.0);
	Ray cameraRay = generateCameraRay(pos);
	Hit cameraHit = rayCastHit(cameraRay, spheres);
		
	if (cameraHit.hit) {
		gl_FragColor = shade(cameraHit, spheres);
	} else {
		gl_FragColor=vec4(sin(gl_FragCoord.xy/5.)/8., 0., 1.);
	}
}