#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct camera {
	vec3 u, v, w; // Axes
	vec3 e; // Origin
};

struct ray {
	vec3 org, dir;
};
	
struct sphere {
	vec3 c;
	float r;
	vec3 color;
};
	
struct intersection {
	bool intersect;
	float t;
	vec3 color;
};
	
camera initialize_camera(vec3 up, vec3 from, vec3 to) {
	camera c;
	c.w = normalize(from - to);
	c.u = normalize(cross(up, c.w));
	c.v = normalize(cross(c.w, c.u));
	c.e = from;
	return c;
}

ray generate_camera_ray(camera c, vec2 position, const vec2 film_size, const float film_distance) {
	ray r;
	r.org = c.e;
	vec3 pixel = position.x * film_size.x * c.u + position.y * film_size.y * c.v + film_distance * c.w + c.e;
	r.dir = normalize(r.org - pixel);
	return r;
}

intersection ray_sphere_intersection(ray r, sphere s) {
	float b = dot(r.dir, r.org - s.c);
	float c = dot(r.org - s.c, r.org - s.c) - s.r * s.r;
	intersection res;
	float d = b * b - c;
	if (d < 0.0) {
		res.intersect = false;
	} else {
		float t1 = (-b + sqrt(d));
		float t2 = (-b - sqrt(d));
		float t = min(t1, t2);
		if (t > 0.0) {
			res.intersect = true;
			res.t = t;
			vec3 nml = normalize((r.org + r.dir * t) - s.c);
			vec3 rd = reflect(r.dir, nml);
			vec3 light = normalize(vec3(-0.5 + mouse.x * 2.0, 1.0, 0.5 + mouse.y * 2.0));
			res.color = (1.0 - dot(rd, light)) / 2.0 * s.color;
		} else {
			res.intersect = false;
		}
	}
	return res;
}

void main(void) {
	// constants and objects
	const vec2 film_size = vec2(10.0, 10.0);
	const float film_distance = 5.0;
	sphere spheres[3];
	spheres[0] = sphere(vec3(0.0), 1.5, vec3(1.0));
	spheres[1] = sphere(vec3(1.0), 2.5, vec3(1.0, 0.0, 0.0));
	spheres[2] = sphere(vec3(2.0), 3.5, vec3(0.0 ,1.0, 0.0));
	
	// normalized coordinates
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	// initialize camera coordinate system
	const vec3 up = vec3(0.0, 0.0, 1.0);
	vec3 from = vec3(0.0, -5.0, 0.0);
	const vec3 to = vec3(0.0, 0.0, 0.0);
	camera c = initialize_camera(up, from, to);
	ray r = generate_camera_ray(c, position, film_size, film_distance);
	
	// check intersection for all objects
	intersection is;
	is.intersect = false;
	for (int i = 0; i < 3; ++i) {
		intersection tmp = ray_sphere_intersection(r, spheres[i]);
		if (tmp.intersect && (!is.intersect || tmp.t < is.t)) {
			is = tmp;
		}
	}
	
	// (shading)
	vec3 color;
	if (is.intersect) {
		color = is.color;
	} else {
		color = vec3(0.0);
	}
	gl_FragColor = vec4(color, 1.0);
}
