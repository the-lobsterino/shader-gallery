#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Sphere {
	vec3 center;
	float radius;
};

struct Light {
	vec3 position;
	float intensity;
};

struct Material {
	vec4 albedo;
	vec3 diffuse;
	float specular_exp;
};

struct Ray {
	vec3 orig;
	vec3 dir;
};

float sdf(vec3 pos) {
	vec3 center = pos - vec3(-3.0, 0.0, -16.0);
	center = vec3(
		center.x * cos(time) - center.z * sin(time),
		center.y,
		center.x * sin(time) + center.z * cos(time)
	);
	center = vec3(
		center.x * cos(time*0.1) - center.y * sin(time*0.1),
		center.x * sin(time*0.1) + center.y * cos(time*0.1),
		center.z
	);
	vec3 box = abs(center) - 3.0;
	return min(
		max(
			max(box.x,
			    box.y),
			max(box.z,
			    3.5 - length(center))
		),
		length(vec2(
			length(vec2(center.x - 2.5, center.z - 2.5)) - 2.5,
			center.y
		)) - 0.75
	);
}

float cast_ray(Ray r) {
	float ray = 0.0;
	float max_ray = 20.0;
	float p_field = .0;
	float cosine = .0;
	for (int i = 0; i < 72; ++i) {
		float field = sdf(r.orig + ray * r.dir);
		ray += field;
		if (field < 1e-5) { return cosine; }
		cosine = field / p_field;
		p_field = field;
		if (ray >= max_ray) { return -2.0; }
	}
	return cosine;
}

vec4 render(Ray r) {
	float cosine = cast_ray(r);
	if (cosine > -1.0) {
		return vec4(1.-cosine,1.-cosine,1.-cosine,1.0);
	}
	return vec4(0.,1.,0.,1.0);
}

void main( void ) {
	vec2 pos = 2.0 * (gl_FragCoord.xy + 0.5) / resolution.xy - 1.0;
	pos.x *= resolution.x / resolution.y;
	float fov = radians(45.0);
	pos *= tan(fov/2.);
	gl_FragColor = render(Ray(
		vec3(0),
		normalize(vec3(pos.x, pos.y, -1.0))
	));
}