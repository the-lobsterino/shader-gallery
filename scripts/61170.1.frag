#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3  light_position       = vec3(1.0, 4.0, -1.0);
const float light_strength = 4.0;
const int   ref_itr        = 8;
const float eps            = 0.001;

struct Ray
{
	vec3 origin;
	vec3 direction;
};

struct Intersection
{
	vec3 position;
	vec3 normal;
	vec3 color;
	float t;
	bool hit;
};

struct Sphere
{
	vec3 position;
	vec3 color;
	float radius;
};

struct Plane
{
	vec3 position;
	vec3 normal;
	vec3 color;
};

void calc_sphere(Ray r, Sphere s, inout Intersection i)
{
	float a = dot(r.direction, r.direction);
	float b = dot(r.direction, r.origin - s.position);
	float c = -2.0 * dot(r.origin, s.position) + dot(r.origin, r.origin) + dot(s.position, s.position) - s.radius * s.radius;
	float d = b * b - a * c;
	
	if (0.0 <= d)
	{
		float t = (-b - sqrt(d)) / a;
		if (eps <= t && t < i.t)
		{
			i.position = r.origin + t * r.direction;
			i.normal   = normalize(i.position - s.position);
			
			vec3 light_dir = normalize(light_position - i.position);
			float diff     = clamp(light_strength * dot(i.normal, light_dir) / distance(light_position, i.position), 0.0, 0.1);
			
			i.color    = s.color * diff;
			i.t        = t;
			i.hit      = true;
		}
	}
}

void calc_plane(Ray r, Plane p, inout Intersection i)
{
	float a = dot(p.position - r.origin, p.normal);
	float b = dot(r.direction, p.normal);
	float t = a / b;
	
	if (eps <= t && t < i.t)
	{
		i.position = r.origin + t * r.direction;
		i.normal   = p.normal;
		
		vec3 light_dir = normalize(light_position - i.position);
		float diff     = clamp(light_strength * dot(i.normal, light_dir) / distance(light_position, i.position), 0.0, 1.0);
		float x = mod(i.position.x, 2.0);
		float z = mod(i.position.z, 2.0);
		diff *= ((x <= 1.0 && z <= 1.0) || (x > 1.0 && z > 1.0)) ? 1.0 : 0.5;
		
		i.color    = p.color * diff;
		i.t        = t;
		i.hit      = true;
	}
}

void main()
{
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	Ray r;
	r.origin    = vec3(0.0, 0.0, 1.0);
	r.direction = normalize(vec3(uv, 0.0) - r.origin);
	
	Intersection i;
	i.color = vec3(0.0);
	i.t     = 1.0e30;
	i.hit   = false;
	
	Sphere s[4];
	s[0].position = vec3( 2.0, -1.0, -3.0);
	s[1].position = vec3( 2.0, -1.0, -7.0);
	s[2].position = vec3(-2.0, -2.0 + sin(time), -3.0);
	s[3].position = vec3(-2.0, -1.0, -7.0);
	s[0].color    = vec3(1.0);
	s[1].color    = vec3(1.0);
	s[2].color    = vec3(1.0);
	s[3].color    = vec3(1.0);
	s[0].radius   = 0.5 + sin(time) * 0.5;
	s[1].radius   = 1.0;
	s[2].radius   = 1.0;
	s[3].radius   = 1.0;
	
	Plane p;
	p.position = vec3(0.0, -2.0, 0.0);
	p.normal   = normalize(vec3(0.0, 1.0, 0.0));
	p.color    = vec3(1.0);
	
	calc_sphere(r, s[0], i);
	calc_sphere(r, s[1], i);
	calc_sphere(r, s[2], i);
	calc_sphere(r, s[3], i);
	calc_plane(r, p, i);
	
	if (i.hit)
	{
		Ray sr;
		sr.origin    = i.position;
		sr.direction = normalize(light_position - i.position);
		Intersection si;
		si.t   = 1.0e30;
		si.hit = false;
		calc_sphere(sr, s[0], si);
		calc_sphere(sr, s[1], si);
		calc_sphere(sr, s[2], si);
		calc_sphere(sr, s[3], si);
		calc_plane(sr, p, si);
		
		Ray rr;
		rr.origin    = i.position;
		rr.direction = reflect(r.direction, i.normal);
		Intersection ri;
		ri.color = vec3(0.0);
		ri.t     = 1.0e30;
		ri.hit   = false;
		vec3 temp = vec3(1.0);
		for (int itr = 0; itr < ref_itr; ++itr)
		{
			calc_sphere(rr, s[0], ri);
			calc_sphere(rr, s[1], ri);
			calc_sphere(rr, s[2], ri);
			calc_sphere(rr, s[3], ri);
			calc_plane(rr, p, ri);
			
			if (!ri.hit) break;
			
			rr.origin    = ri.position;
			rr.direction = reflect(rr.direction, ri.normal);
			
			i.color += temp * ri.color;
			temp *= ri.color;
		}
		
		i.color *= si.hit ? 0.5 : 1.0;
	}
	gl_FragColor = vec4(i.color, 1.0);
}