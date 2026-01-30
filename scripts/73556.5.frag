#ifdef GL_ES
precision mediump float;
#endif

#define NUM_SPHERE 3
#define M_PI 3.14159

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
  	vec3 origin;
 	vec3 direction;
};

struct Sphere {
	float radius;
  	vec3 center;
  	vec3 color;
};

struct Light {
  	vec3 position;
  	float intensity;
};

struct Plane {
  	float height;
  	vec3 color;
};

struct Intersection {
	bool hit;
	float t;
	vec3 position;
	vec3 normal;
};

Sphere spheres[NUM_SPHERE];
Light light;
Plane plane;

Intersection intersect_sphere(Ray ray, Sphere sphere) {
  	vec3 v = ray.origin - sphere.center;
	float b = dot(ray.direction, v);
	float c = dot(v, v) - sphere.radius * sphere.radius;
	float D = b * b - c;
	if(D < 0.) {
		return Intersection(false, 0., vec3(0), vec3(0));
	}else{
    		float t = - b - sqrt(D);
  		vec3 hit_point = ray.origin + ray.direction * t;
    		vec3 normal = (hit_point - sphere.center) / sphere.radius;
  		return Intersection(true, t, hit_point, normal);
  	}
}

Intersection intersection_plane(Ray ray, Plane p) {
	float t = (p.height-ray.origin.y) / ray.direction.y;
	if (t < 0.0) {
		return Intersection(false, 0., vec3(0), vec3(0));
	}else{
  		vec3 hit_point = ray.origin + ray.direction * t;
		return Intersection(true, t, hit_point, vec3(0., 1., 0.));
	}
}

vec3 shade(Light light, Intersection intersect, vec3 color) {
	vec3 l = light.position - intersect.position;
	float r = length(l);
	return min(color * light.intensity * dot(intersect.normal, l) / (4. * M_PI * r * r),1.0);
}

vec3 ray_trace(Ray ray){
  	Intersection first_intersect = Intersection(false, 0., vec3(0), vec3(0));
  	Sphere first_sphere;
  	float min_t = 1e9; 
  	vec3 color = vec3(0.0);
  	for (int i = 0; i < NUM_SPHERE; i++){
    		Sphere sphere = spheres[i];
    		Intersection intersect = intersect_sphere(ray,sphere);
	  	if (0.0 < intersect.t && intersect.t < min_t){
			first_intersect = intersect;
		  	first_sphere = sphere;
		  	min_t = intersect.t;
	  	}
  	}

 	 if (first_intersect.hit){
		Ray ray2;
		ray2.origin = light.position;
		ray2.direction = normalize(first_intersect.position - light.position);
		Intersection first_intersect2 = Intersection(false, 0., vec3(0), vec3(0));
  		Sphere first_sphere2;
		float min_t2 = intersect_sphere(ray2,first_sphere).t;
		for (int i = 0; i < NUM_SPHERE; i++){
   			Sphere sphere2 = spheres[i];
			if (first_sphere == sphere2) continue;
    			Intersection intersect2 = intersect_sphere(ray2,sphere2);
	  		if (0.0 < intersect2.t && intersect2.t < min_t2){
		  		first_intersect2 = intersect2;
		  		first_sphere2 = sphere2;
		  		min_t2 = intersect2.t;
	  		}
  		}
		if(first_intersect2.hit) color = max(0.2 * shade(light, first_intersect,first_sphere.color),first_sphere.color*vec3(0.2));
		else color = max(shade(light, first_intersect,first_sphere.color),first_sphere.color*vec3(0.2));
		 
  	}
	else{
		Intersection intersect_p = intersection_plane(ray, plane);
		if (intersect_p.hit){
			Ray ray2;
			ray2.origin = light.position;
			ray2.direction = normalize(intersect_p.position - light.position);
			Intersection first_intersect2 = Intersection(false, 0., vec3(0), vec3(0));
  			Sphere first_sphere2;
			float min_t2 = intersection_plane(ray2,plane).t;
			for (int i = 0; i < NUM_SPHERE; i++){
   				Sphere sphere2 = spheres[i];
    				Intersection intersect2 = intersect_sphere(ray2,sphere2);
	  			if (0.0 < intersect2.t && intersect2.t < min_t2){
		  			first_intersect2 = intersect2;
		  			first_sphere2 = sphere2;
		  			min_t2 = intersect2.t;
	  			}
  			}
			if(first_intersect2.hit) color = 0.2 * shade(light, intersect_p,plane.color);
			else color = shade(light, intersect_p,plane.color);
		}
	}
  	return color;
}

Ray generate_camera_ray(vec2 p) {
	Ray ray;
	ray.origin = vec3(0.0, 0.0, -1.0);
	ray.direction = normalize(vec3(p.x,p.y,0.)-ray.origin);
	return ray;
}

void main(void) {
  	//initialize spheres
  	spheres[0] =  Sphere(1.0, vec3(-2.0, -1.0, 12.0), vec3(1.0, 0.0, 0.0));
  	spheres[1] =  Sphere(1.0, vec3(-2.0, 0.0, 18.0), vec3(0.0, 1.0, 0.0));
  	spheres[2] =  Sphere(2.0, vec3(1.5, 1.0, 14.0), vec3(0.0, 0.0, 1.0));
	
	//initialize light source
  	light =  Light(vec3(4.0, 7.0, 5.0),1000.0);

  	//initialize floor
 	plane = Plane(-3.0,vec3(1.0,1.0,1.0));

  	vec2 p = (gl_FragCoord.xy - resolution / 2.0) / min(resolution.x, resolution.y);

  	//initialize ray
  	Ray ray = generate_camera_ray(p);
  	
  	//ray_trace
  	vec3 color = ray_trace(ray);
  	gl_FragColor = vec4(color, 1.0);
}
