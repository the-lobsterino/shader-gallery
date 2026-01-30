precision mediump float;
uniform float t;
uniform float time;
uniform vec2 resolution;

vec3 LightSource = vec3(0.4, 0.6,0.4);

struct Sphere {
	float radius;
	vec3 center;
	vec3 color;
	float reflectance;
};
	
struct Plane {
	vec3 center;
	vec3 normal;
	vec3 color;
	float reflectance;
};

struct Ray {
	vec3 origin;
	vec3 direction;
};
	
struct Intersection {
	int hitNum;
	bool isHit;
	float t;
	vec3 hitPoint;
	vec3 normal;
	vec3 color;
	float reflectance;
};

Intersection SphereRayIntersect(Ray r, Sphere s, Intersection is) {
	// |origin - t*direction - center|^2 = r^2
	// at^2 + bt + c = 0の形に変形して判別式を利用
	vec3 oc = r.origin - s.center;
	float a = dot(r.direction, r.direction);
	float b = dot(r.direction, oc) * 2.0;
	float c = dot(oc, oc) - s.radius*s.radius;
	float d = b*b - 4.0*a*c;
	if (d >= 0.0) {
		float t = (-b - sqrt(d))/(2.0*a);
		if (t > 0.0 && is.t > t) {
			is.hitNum++;
			is.isHit = true;
			is.t = t;
			is.hitPoint = r.origin + r.direction*t;
			is.normal = normalize(is.hitPoint - s.center);
			is.color = s.color * (clamp(dot(LightSource, is.normal), 0.1, 1.0));
			is.reflectance = s.reflectance;
		}
	}
	return is;
}

Intersection PlaneRayIntersect(Ray r, Plane p, Intersection is) {
	vec3 s = r.origin - p.center;
	float dn = dot(r.direction, p.normal);
	float sn = dot(s, p.normal);
	if (dn != 0.0) {
		float t = -sn/dn;
		if (t > 0.0 && is.t > t) {
			is.hitNum++;
			is.isHit = true;
			is.t = t;
			is.hitPoint = s + t * r.direction;
			is.normal = p.normal;
			is.color = p.color * (clamp(dot(LightSource, is.normal), 0.1, 1.0));
			is.reflectance = p.reflectance;
		}
	}
	return is;
}

Sphere sphere;
Plane planes[6];

Intersection IntersectAllObject(Ray r, Intersection is) {
	is = SphereRayIntersect(r, sphere, is);
	is = PlaneRayIntersect(r, planes[0], is);
	is = PlaneRayIntersect(r, planes[1], is);
	is = PlaneRayIntersect(r, planes[2], is);
	is = PlaneRayIntersect(r, planes[3], is);
	is = PlaneRayIntersect(r, planes[4], is);
	is = PlaneRayIntersect(r, planes[5], is);
	return is;
}

Intersection IntersectAllPlanes(Ray r, Intersection is) {
	is = PlaneRayIntersect(r, planes[0], is);
	is = PlaneRayIntersect(r, planes[1], is);
	is = PlaneRayIntersect(r, planes[2], is);
	is = PlaneRayIntersect(r, planes[3], is);
	is = PlaneRayIntersect(r, planes[4], is);
	is = PlaneRayIntersect(r, planes[5], is);
	return is;
}

Intersection MultipleIntersect(Ray r, Intersection is) {
	Ray r2;
	Intersection is2;
	r2 = r;
	is2 = is;
	for (int i=0; i<2; i++) {
		is2 = IntersectAllObject(r2, is2);
		r2.origin = is2.hitPoint + is2.normal * 0.0001;
		r2.direction = reflect(r2.direction, is2.normal);
		is2.t = 10000.0;
		is.color += is2.color*0.5;
	}
	//is.color = is2.color;
	return is;
}

void main(void) {
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	Intersection is;
	is.isHit = false;
	is.t = 10000.0;
	is.hitPoint = vec3(0.0);
	is.normal = vec3(0.0);
	is.color = vec3(0.0);

	Ray ray;
	ray.origin = vec3(0.0, 0.0, 5.0);
	ray.direction = normalize(vec3(position.x, position.y, -1.0));
	
	sphere;
	sphere.radius = 4.0;
	sphere.center = vec3(6.0*cos(time), 0.0, -8.0);
	sphere.color = vec3(1.0, 1.0, 1.0);
	sphere.reflectance = 1.0;
	
	planes[0].center = vec3(0.0, -8.0, 0.0);
	planes[0].normal = vec3(0.0, 1.0, 0.0);
	planes[0].color = vec3(1.0, 1.0, 1.0);
	planes[0].reflectance = 0.0;
	
	planes[1].center = vec3(0.0, 0.0, -10.0);
	planes[1].normal = vec3(0.0, 0.0, 1.0);
	planes[1].color = vec3(1.0, 1.0, 1.0);
	planes[1].reflectance = 0.0;
	
	planes[2].center = vec3(-18.0, 0.0, -5.0);
	planes[2].normal = vec3(1.0, 0.0, 0.0);
	planes[2].color = vec3(1.0, 0.0, 0.0);
	planes[2].reflectance = 0.0;
	
	planes[3].center = vec3(18.0, 0.0, -5.0);
	planes[3].normal = vec3(1.0, 0.0, 0.0);
	planes[3].color= vec3(0.0, 1.0, 0.0);
	planes[3].reflectance = 0.0;
	
	planes[4].center = vec3(0.0, 8.0, 0.0);
	planes[4].normal = vec3(0.0, 1.0, 0.0);
	planes[4].color = vec3(1.0);
	planes[4].reflectance = 0.0;
	
	planes[5].center = vec3(0.0, 0.0, 10.0);
	planes[5].normal = vec3(0.0, 0.0, 1.0);
	planes[5].color = vec3(1.0);
	
	vec3 backgroundColor = vec3(1.0, 1.0, 1.0);
	
	is = SphereRayIntersect(ray, sphere, is);
	if (is.isHit) {
		Intersection is2;
		is2.isHit = false;
		is2.t = 10000.0;
		is2.hitPoint = vec3(0.0);
		is2.normal = vec3(0.0);
		is2.color = is.color;
		Ray r2;
		r2.origin = is.hitPoint;
		r2.direction = reflect(ray.direction, is.normal);
		is2 = IntersectAllPlanes(r2, is2);
		is.color += vec3(1.0) * is.color * is2.color;
	}
	is = IntersectAllPlanes(ray, is);
	//is = MultipleIntersect(ray, is);
	gl_FragColor = vec4(is.color, 1.0);
}