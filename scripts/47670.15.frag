#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

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
	vec4 color;
};
struct Plane {
	float z;
	float size;
	vec4 color;
};
struct Camera {
	vec3 from;
	vec3 up;
	vec3 to;
	float film_w;
	float film_h;
	float film_d;
};
struct Hit {
	bool hit; // ぶつかったか？空のHitを作りたい
	float t;
	vec4 color;
};

vec3 pixel_in_world_coord(vec2 pos, Camera cam) {
	float x, y, z;
	vec3 w, u, v, e;
	// cam coord -> world coord
	w = normalize(cam.from - cam.to);
	u = normalize(cross(cam.up, w));
	v = cross(w, u);
	e = cam.from;
	// pixel in cam coord
	x = cam.film_w * (pos.x-0.5);
	y = cam.film_h * (pos.y-0.5);
	z = cam.film_d;
	return x*u + y*v + z*w + e;
}

	
Ray generate_camera_ray(vec2 pos, Camera cam) {
	// カメラの位置とピクセルの情報からレイを作る
	// posは(0~1, 0~1)
	Ray v;
	vec3 pixel = pixel_in_world_coord(pos, cam);
	v.origin = cam.from;
	v.direction = normalize(v.origin - pixel);
	return v;
}

Hit intersect(Ray ray, Sphere s) {
	// どこでその物体とぶつかるかを返す
	Hit h;
	// a t^2 + b t + c = 0をとく
	float a = dot(ray.direction, ray.direction);
	float b = 2.0 * dot(ray.direction, (ray.origin - s.center));
	float c = dot((ray.origin - s.center), (ray.origin - s.center)) - s.radius*s.radius;
	float inside_sqrt = b*b - 4.0*a*c;
	if (inside_sqrt >= 0.0) {
		float x1 = (-b + sqrt(inside_sqrt)) / (2.0*a);
		float x2 = (-b - sqrt(inside_sqrt)) / (2.0*a);
		if (x1 >= 0.0 && x2 >= 0.0) {
			// ぶつかってる!
			h.hit = true;
			h.t = min(x1, x2);
			h.color = s.color;
		}
	} else {
		// 虚数解、ぶつかってない
		h.hit = false; 
	}
	return h;
}

Hit intersect_p(Ray ray, Plane p) {
	// for debug
	Hit h;
	float t = (p.z - ray.origin.z) / ray.direction.z;
	vec3 v = ray.origin + (t * ray.direction);
	if (t >= 0.0 && abs(v.x) <= p.size && abs(v.y) <= p.size) {
		h.hit = true;
		h.color = p.color;
		h.t = t;
	} else {
		h.hit = false;	
	}
	return h;
}

void main( void ) {
	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 pos = (gl_FragCoord.xy / resolution.xy);

	float color = 0.5;
	
	// カメラ
	Camera c;
	c.from = vec3(0, 2, 5);
	c.up = vec3(0, 1, 0);
	c.to = vec3(0, 0, 0);
	c.film_w = 16.0;
	c.film_h = 9.0;
	c.film_d = 1.0;
	
	// 球
	Sphere s[2];
	s[0].color = vec4(0.0, 1.0, 0.0, 1.0);
	s[0].radius = 1.0;
	s[0].center = vec3(0.0, 5.0, 1.0);
	s[1].color = vec4(1.0, 0.0, 0.0, 1.0);
	s[1].radius = 3.0;
	s[1].center = vec3(3.0, 0.0, 1.0);
	
	// プレーン
	Plane p;
	p.z = 0.0;
	p.size = 10.0;
	p.color = vec4(1.0, 1.0, 1.0, 1.0);
	
	// レイトレーシング
	Ray ray = generate_camera_ray(pos, c);
	
	Hit hit, first_hit;
	first_hit.hit = false;
	
	// plane
	hit = intersect_p(ray, p);
	if (hit.hit) {
		first_hit = hit;
	}
	
	for (int i = 0; i < 2; i++) {
		hit = intersect(ray, s[i]);
		// ぶつかっていて、今までのよりも手前にあれば、これを採用
		if (hit.hit && (first_hit.hit == false || first_hit.t > hit.t)) first_hit = hit;
	}
	
	if (first_hit.hit) {
		// ものにぶつかってるところ
		gl_FragColor = first_hit.color;	
	} else {
		// ぶつかってないところ
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}