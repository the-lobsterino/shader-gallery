#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const float eps              = 0.001;
vec3  light_position         = vec3(4.0);
const float light_strength   = 16.0;
const int   reflection_count = 6;
const float plane_diff_strength  = 1.0;
const float sphere_diff_strength = 0.05;

#define init_i(it) it.hit = false; it.t = 1.0e30; it.position = vec3(0.0); it.normal = vec3(0.0); it.color = vec3(0.0);

struct Ray
{
	vec3 origin;
	vec3 direction;
};

struct Intersection
{
	bool hit;
	float t;
	vec3 position;
	vec3 normal;
	vec3 color;
};

struct Plane
{
	vec3 position;
	vec3 normal;
	vec3 color;
};

struct Sphere
{
	vec3 position;
	float radius;
	vec3 color;
};

void calc_plane(Ray r, Plane p, inout Intersection i)
{
	float a = dot(p.position - r.origin, p.normal);
	float b = dot(r.direction, p.normal);
	float t = a / b;
	
	if (eps < t && t < i.t)
	{
		i.hit = true;
		i.t   = t;
		i.position = r.origin + t * r.direction;
		i.normal   = p.normal;
		
		vec3 light_direction = normalize(light_position - i.position);
		float diff = clamp(light_strength * dot(i.normal, light_direction) / distance(i.position, light_position), 0.0, plane_diff_strength);
		float mx   = mod(i.position.x, 2.0);
		float mz   = mod(i.position.z, 2.0);
		i.color    = p.color * diff;
		if ((mx < 1.0 && mz < 1.0) || (mx >= 1.0 && mz >= 1.0)) i.color *= 0.5;
	}
}

void calc_sphere(Ray r, Sphere s, inout Intersection i)
{
	float a = dot(r.direction, r.direction);
	float b = dot(r.direction, r.origin - s.position);
	float c = dot(r.origin, r.origin) + dot(s.position, s.position) - 2.0 * dot(r.origin, s.position) - s.radius * s.radius;
	float d = b * b - a * c;
	
	if (0.0 <= d)
	{
		float t, tp, tn;
		tp = (-b + sqrt(d)) / a;
		tn = (-b - sqrt(d)) / a;
		if (eps < tn && tn < i.t) t = tn;
		else if (eps < tp && tp < i.t) t = tp;
		else return;
		
		i.hit = true;
		i.t   = t;
		i.position = r.origin + t * r.direction;
		i.normal   = normalize(i.position - s.position);
		
		vec3 light_direction = normalize(light_position - i.position);
		float diff = clamp(light_strength * dot(i.normal, light_direction) / distance(i.position, light_position), 0.0, sphere_diff_strength);
		i.color    = s.color * diff;
	}
}

void calc_scene(Ray r, inout Intersection i)
{
	Plane p;
	p.position = vec3(0.0, -1.0, 0.0);
	p.normal   = normalize(vec3(0.0, 1.0, 0.0));
	p.color    = vec3(1.0);
	
	Sphere s[3];
	s[0].position = vec3( 1.0, -0.5, -0.5 + sin(time));
	s[1].position = vec3(-1.0 + sin(time), -0.5, -0.5);
	s[2].position = vec3( 0.0, -0.5, -3.0);
	s[0].radius   = 0.3;
	s[1].radius   = 0.3;
	s[2].radius   = 1.0 + cos(time) * 0.5;
	s[0].color    = vec3(1.0);
	s[1].color    = vec3(1.0);
	s[2].color    = vec3(1.0);
	
	calc_plane(r, p, i);
	calc_sphere(r, s[0], i);
	calc_sphere(r, s[1], i);
	calc_sphere(r, s[2], i);
}

void calc_shade(inout Intersection i)
{
	if (!i.hit) return;
	
	Ray r;
	r.origin    = i.position;
	r.direction = normalize(light_position - r.origin);
	
	Intersection temp;
	init_i(temp)
	
	calc_scene(r, temp);
	if (temp.hit) i.color *= 0.5;
}

void calc_reflection(Ray r, inout Intersection i)
{
	if (!i.hit) return;
	
	Intersection temp;
	init_i(temp);
	temp.position = i.position;
	temp.normal   = i.normal;
	
	vec3 k = vec3(1.0);
	
	for (int l = 0; l < reflection_count; ++l)
	{
		r.origin    = temp.position;
		r.direction = reflect(r.direction, temp.normal);
		
		init_i(temp)
		
		calc_scene(r, temp);
		calc_shade(temp);
		
		if (!temp.hit) break;
		
		i.color += k * temp.color;
		k *= temp.color;
	}
}

void main()
{
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	Ray r;
	r.origin    = vec3(0.0, 0.0, 1.0);
	r.direction = normalize(vec3(uv.x, uv.y, 0.0) - r.origin);
	
	Intersection i;
	init_i(i)
	
	calc_scene(r, i);
	calc_reflection(r, i);
	calc_shade(i);

	
	gl_FragColor = vec4(i.color, 1.0);
}