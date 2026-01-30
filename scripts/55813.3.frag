/*
 181010
 parentも自分のものです(途中でブラウザを変えたため)
*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265;

struct Ray {
	vec3 origin;
	vec3 dir;
};
	
struct Camera {
	vec3 pos;
	vec3 dir;
	vec3 up;
};

Camera initCameraLookingAt(vec3 pos, vec3 target) {
	Camera cam;
	cam.pos = pos;
	cam.dir = normalize(target - pos);
	cam.up = normalize(cross(cam.dir, cross(vec3(0,1,0), cam.dir)));
	//cam.up = vec3(0,1,0);
	return cam;
}
	
Ray generateCameraRay(Camera cam, vec2 pixel) {
	vec2 film_wh = vec2(16.0, 16.0 * resolution.y/resolution.x);
	float distance_to_film = 16.0;
	vec3 film_pixel = vec3(film_wh * (pixel.xy + 0.5) / resolution.xy, distance_to_film);
	vec3 w = -normalize(cam.dir);
	vec3 u = normalize(cross(cam.up, w));
	vec3 v = cross(w, u);
	vec3 e = cam.pos;
	vec3 world_pixel =
		film_pixel.x * u
		+ film_pixel.y * v
		+ film_pixel.z * w
		+ e;
	Ray ray;
	ray.origin = e;
	ray.dir = normalize(e - world_pixel);
	return ray;
} 


struct Hit {
	bool valid;
	float t;
	vec3 pos;
	vec3 nvec;
	vec3 color;
};
		
struct Sphere {
	float r;
	vec3 pos;
	vec3 color;
};	
Hit intersectSphere(Sphere obj, Ray ray) {
	Hit h;
	vec3 o = ray.origin;
	vec3 d = ray.dir;
	vec3 center = obj.pos;
	float r = obj.r;
	float a = dot(d, d);
	float b_ = dot(d, o-center);
	float c = dot(o-center, o-center) - r*r;
	if (b_ * b_ - a * c > 0.0) {
		float t1 = (-b_ + sqrt(b_ * b_ - a * c)) / a;
		float t2 = (-b_ - sqrt(b_ * b_ - a * c)) / a;
	
		if (t1 > 0.0 && t2 > 0.0) { // two positives: hit points are front
			// t1 > t2
			h.t = t2;
			h.pos = o + h.t * d;
			h.nvec = normalize(h.pos - obj.pos);
			h.color = obj.color;
			h.valid = true;
			return h;
		}
	}
	h.valid = false;
	return h;
}

struct Plane {
	vec3 pos;
	vec3 nvec;
	vec3 color;
};
	
Hit intersectPlane(Plane obj, Ray ray) {
	Hit h;
	vec3 o = ray.origin;
	vec3 d = ray.dir;
	vec3 oc = obj.pos - ray.origin;
	vec3 n = obj.nvec;
	if (dot(d, n) != 0.0) {
		float t = dot(oc, n) / dot(d, n);
		if (t > 0.0) {
			h.t = t;
			h.pos = o + d * t;
			if (dot(d,n) > 0.0) h.nvec = -obj.nvec;
			else h.nvec = obj.nvec;
			h.color = obj.color;
			h.valid = true;
			return h;
		}
	}
	h.valid = false;
	return h;
}




struct Light {
	vec3 pos;
	float power;
};


vec3 basicShade(Light li, Hit h) {
	//return h.color;
	float r = length(li.pos-h.pos);
	float irradiance = dot(h.nvec, normalize(li.pos-h.pos)) / (4.0*PI*r*r);
	return  h.color * clamp(li.power * irradiance, 0.1, 1.0);
}

bool checkShadow(vec3 pos, Light li, Sphere dropper) {
	
	Ray r;
	r.origin = pos;
	r.dir = normalize(li.pos - pos);
	Hit h = intersectSphere(dropper, r);
	return h.valid;
}

void main( void ) {
	//gl_FragColor = vec4( gl_FragCoord.xy / resolution.xy, 0.0, 1.0);

	vec2 pixel = (gl_FragCoord.xy * 2.0) - resolution; // 画面中心を(0,0)
	float phase = mod(time, 20.0) / 20.0;
	vec3 campos = vec3(4.0 * cos(phase * 2.0 * PI), -3.0, 4.0 * sin(phase * 2.0 * PI));
	Camera camera = initCameraLookingAt(campos, vec3(0,0,0));
	Sphere sphere;
	sphere.r = 1.5;
	sphere.pos = vec3(0.5, 0, -1.5);
	sphere.color = vec3(1.0, 1.0, 0);
	
	Sphere sphere2;
	sphere2.r = 1.0;
	sphere2.pos = vec3(-1.5, 0, 1.5);
	sphere2.color = vec3(0, 0, 1.0);
	
	Plane plane;
	plane.nvec = normalize(vec3(0, -1, 0));
	plane.pos = vec3(0, 1, 0);
	plane.color = vec3(1.0);
	
	Light light;
	light.pos = vec3(-3.0, -3.0, 0);
	light.power = 90.0;
	
	Ray ray = generateCameraRay(camera, pixel);
	
	Hit hits[3], first_hit;
	first_hit.valid = false;
	hits[0] = intersectSphere(sphere, ray);
	hits[1] = intersectPlane(plane, ray);
	hits[2] = intersectSphere(sphere2, ray);
	for (int i=0; i<3; i++) {
		if (hits[i].valid) {
			if (!first_hit.valid || first_hit.t > hits[i].t) {
				first_hit.valid = hits[i].valid;
				first_hit.t = hits[i].t;
				first_hit.pos = hits[i].pos;
				first_hit.nvec = hits[i].nvec;
				first_hit.color = hits[i].color;
			}
		}
	}
	if (first_hit.valid && !checkShadow(first_hit.pos, light, sphere) && !checkShadow(first_hit.pos, light, sphere2)) {
		gl_FragColor = vec4(basicShade(light, first_hit), 1.0);
	} else {
		gl_FragColor = vec4(0, 0, 0, 1.0);
	}
	


	/*
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	*/
}