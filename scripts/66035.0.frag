// 120720N 3D spheres sizes calculated with mandelset

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 square(vec2 z)
{
	float x = z.x, y = z.y;
	return vec2(x * x - y * y, 2.0 * x * y);
}

float mandelbrot(vec2 c)
{
	int MAX_ITERATION = 120;
	
	vec2 z = c;
	float count = 0.0;
	
	for (int i = 0; i < 120; i++)
	{
		z = square(z) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}



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
	

#define MAX_SPHERES	10
	
void main( void ) {
	vec2 position = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x, resolution.y);
	// position *=2.5;
	// position /= dot(position, position);
	
	Ray ray;
	ray.origin = vec3(0.0, 0.0, 6.);
	ray.direction = vec3(position.x, position.y, -1.0 - 2.5*abs(sin(time*0.1)));
	

	float t = time;
	Sphere sphere[MAX_SPHERES];

	for(int i=0;i<MAX_SPHERES;i++) {
		float fi = float(i);		
		vec2 po = vec2(position.x*fi, position.y*fi);
		float mb = mandelbrot(po);
		sphere[i].radius = mb*.2;
		sphere[i].position = vec3(po, 3. );
		sphere[i].color = vec3(1.0, 1.0, 1.0);
	}
	
	
	
	Plane plane;
	plane.position = vec3(0.0, -1.0, 0.0);
	plane.normal = vec3(0.0, 1.0, 0.0);
	plane.color = vec3(1.0);
	
	Intersection intersect;
	intersect.hitpoint = vec3(0.0);
	intersect.normal = vec3(0.0);
	intersect.color = vec3(0.0);

	intersectPlane(ray, plane, intersect);

	for(int i=0;i<MAX_SPHERES;i++) {
		intersectSphere(ray, sphere[i], intersect);		
	}
		
	gl_FragColor = vec4(intersect.color, 1.0);
}