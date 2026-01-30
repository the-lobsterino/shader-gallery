#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
	vec3 origin;
	vec3 direction;
};
	
struct Sphere {
	vec3 center;
	float radius;
};
	
struct Intersection {
	float Z;
	vec3 position;
	vec3 normal;
	vec2 texcoord;
};
	
vec3 tex(vec2 tc){
	if(mod(float(floor(tc.x) + floor(tc.y)), 2.0) == 0.0){
		return vec3(1.0, 1.0, 1.0);
	} else {
		return vec3(1.0, 0.0, 0.0);
	}
}

vec3 tex2(vec2 tc){
	if(mod(float(floor(tc.x) + floor(tc.y)), 2.0) == 0.0){
		return vec3(1.0, 1.0, 1.0);
	} else {
		return vec3(0.0, 0.0, 1.0);
	}
}
	
vec2 uv(vec3 normal)
{
	return vec2(0.5 + atan(normal.z, normal.x) / (2.0 * PI), 0.5 - asin(normal.y) / PI);
}

vec2 rotate(vec2 v, float angle)
{
	return vec2(v.x*cos(angle) - v.y*sin(angle), v.x*sin(angle) + v.y*cos(angle));	
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

Intersection intersect(Ray ray, Sphere sphere)
{
	Intersection isec; isec.Z = -1111.0;
	float a = dot(ray.direction, ray.direction);
	float b = 2.0 * dot(ray.direction, (ray.origin - sphere.center));
	float c = dot((ray.origin - sphere.center), (ray.origin - sphere.center)) - sphere.radius * sphere.radius;
	float d = b*b - 4.0*a*c;
	if(d>=0.0){
		isec.Z = min((-b - sqrt(d))/(2.0*a), (-b + sqrt(d))/(2.0*a));
		isec.position = ray.origin + ray.direction * isec.Z;
		isec.normal = (isec.position - sphere.center) / sphere.radius;
		isec.texcoord = uv(isec.normal);
	}
	return isec;
}


	
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5); position.x *= resolution.x/resolution.y;

	vec3 color = vec3(0.1, 0.1, 0.1);
	vec3 lightDir = normalize(vec3(1.0, 0.5, sin(time) * 1.5 - 2.0));
	
	Intersection is;
	Ray camera_ray = Ray(vec3(position.x + sin(time*3.0)*0.1, position.y + sin(time*3.1+PI)*0.2, -5.0), vec3(position.x * 0.2, position.y * 0.2, 1.0));
	Sphere s = Sphere(vec3(-1.0, 0.0, 0.4), 0.4 + sin(time)*0.2);
	Sphere s2 = Sphere(vec3(1.0, 0.0, 0.4), 0.4 + sin(time+PI)*0.2);
	
	is = intersect(camera_ray, s);

	if(is.Z>0.0){
		float lightIntensity = dot(is.normal, lightDir);
		color += tex(is.texcoord * 20.0 * (sin(time*2.0)+1.5) + vec2(time,0.0)) * (lightIntensity>0.0?lightIntensity + 0.1:0.1);
	}
	
	is = intersect(camera_ray, s2);

	if(is.Z>0.0){
		float lightIntensity = dot(is.normal, lightDir);
		color += tex2(rotate(is.texcoord * 20.0 + vec2(0.0, time), sin(time*0.3))) * (lightIntensity>0.0?lightIntensity + 0.1:0.1);
	}
	
	color *= rand(position+time);
	
	gl_FragColor = vec4(color, 1.0 );

}