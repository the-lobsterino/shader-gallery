
// antialiasedCircle  by I.G.P  2015-06-14

precision mediump float;

#define sphRadius 3.2
#define sphHalo 0.8

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray{
	vec3 origin;
	vec3 direction;
};

struct Sphere{
	float radius;
	vec3 position;
};

float intersectSphere(Ray R, Sphere S)
{
	vec3 a = R.origin - S.position;
	float b = dot(a, R.direction);
	float c = dot(a,a) - (S.radius * S.radius);
	float d = b * b - c;
	if(d >= 0.0)
		d = -b -sqrt(d);
	return d;
}

void main(){
	Ray ray;
	vec2 p = (gl_FragCoord.xy*2.0 - resolution) / min(resolution.x,resolution.y);
	ray.origin = vec3(0.0, 0.0, 5.0);
	ray.direction = normalize(vec3(p.x,p.y, -1.0));
	Sphere sphere;
	sphere.radius = sphRadius;
	sphere.position = vec3(0.0);
	vec3 sphere_color = vec3(0.2, 0.5, 1);
	float d = intersectSphere(ray,sphere);
	if (d < 0.0)
	  gl_FragColor = vec4(sphere_color + sphHalo * d, 1.0);
	else
	  gl_FragColor = vec4(sphere_color, 1.0);
		
}

