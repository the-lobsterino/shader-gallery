#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

// uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
//light sources

// math coefficients
const float PI = 3.14159265358979;

float vec2cos(vec3 a, vec3 b){
	return abs(dot(a, b) / (length(a) * length(b)));
}

struct Intersection{
	float t;
	vec3 normal_vector;
};

struct Ray{
	vec3 direction, origin;
};

struct Plain{
	vec3 xyz;
	float constant;
	vec3 colour;
};

Intersection intersection_plain(Ray ray, Plain pl){
	float tmp = -(dot(pl.xyz, ray.origin) + pl.constant) / dot(pl.xyz, ray.direction);
	Intersection ret;
	if(tmp > 0.0){
		ret.t = tmp;
		ret.normal_vector = pl.xyz;
	}else{
		ret.t = 100000.0;
		ret.normal_vector = vec3(0.0, 0.0, 0.0);
	}
	return ret;
}

struct Sphere{
	vec3 center;
	float radius;
	vec3 colour;
};

Intersection intersection_sphere(Ray ray, Sphere s){
	vec3 p = s.center - ray.origin;
	float b = dot(ray.direction, p);
	float c = dot(p, p) - pow(s.radius, 2.0);
	float d = pow(b, 2.0) - c;
	Intersection ret;
	if(d > 0.0){
		d = sqrt(d);
		if(b - d > 0.0){
			ret.t = b - d;
			ret.normal_vector = normalize(ray.direction * ret.t - p);
		}else if(b + d > 0.0){
			ret.t = b + d;
			ret.normal_vector = normalize(ret.t - ray.direction * ret.t);
		}else{
			ret.t = 100000.0;
			ret.normal_vector = vec3(0.0, 0.0, 0.0);
		}
	}else if(0.0 == d && b > 0.0){
		ret.t = b;
		ret.normal_vector = normalize(ray.direction * ret.t - p);
	}else{
		ret.t = 100000.0;
		ret.normal_vector = vec3(0.0, 0.0, 0.0);
	}
	return ret;
}

Ray camera_ray(vec3 camOrigin){ 
	vec2 tmp = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(tmp, 0.0) - camOrigin);
	Ray ret; ret.direction = dir; ret.origin = camOrigin;
	return ret;
}

void main(void) {
    vec2 mouse_coord = mouse * 2.0 - 1.0;
	vec3 camOrigin = vec3(0.0, 0.0, -1.0) + vec3(mouse_coord, 0.0);
	Ray camRay = camera_ray(camOrigin);
	vec3 rayOrigin1 = vec3(0.0, 1.0, 0.0);
	vec2 pixel = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// generate sphere objects.
	Sphere sphere1;
	sphere1.center = vec3(0.2, -0.3, 0.4);
	sphere1.radius = 0.5;
	sphere1.colour = vec3(0.0, 0.5, 1.0);
    // generate plain objects.
    // back, left, right, floor. ceil
	Plain plain1, plain2, plain3, plain4, plain5;
    plain1.xyz = vec3(0.0, 0.0, 1.0); plain1.constant = -2.0; plain1.colour = vec3(1.0, 0.5, 0.4);
    plain2.xyz = vec3(1.0, 0.0, 0.0); plain2.constant = 1.5; plain2.colour = vec3(1.0, 0.9, 0.7);
    plain3.xyz = vec3(1.0, 0.0, 0.0); plain3.constant = -1.5; plain3.colour = vec3(1.0, 0.9, 0.7);
    plain4.xyz = vec3(0.0, 1.0, 0.0); plain4.constant = 0.8; plain4.colour = vec3(1.0, 1.0, 1.0);
    plain5.xyz = vec3(0.0, 1.0, 0.0); plain5.constant = -1.0; plain5.colour = vec3(0.0, 0.9, 0.6);

	float t = 100000.0;
    Intersection tmp;
	// compute intersection with sphere.
    tmp = intersection_sphere(camRay, sphere1);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * sphere1.colour, 1.0);
    }

	// compute intersection with plains.
    tmp = intersection_plain(camRay, plain1);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * plain1.colour, 1.0);
    }
    tmp = intersection_plain(camRay, plain2);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * plain2.colour, 1.0);
    }
    tmp = intersection_plain(camRay, plain3);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * plain3.colour, 1.0);
    }
    tmp = intersection_plain(camRay, plain4);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * plain4.colour, 1.0);
    }
    tmp = intersection_plain(camRay, plain5);
    if(tmp.t < t){
        t = tmp.t;
		gl_FragColor = vec4(vec2cos(camRay.direction, tmp.normal_vector) * plain5.colour, 1.0);
    }

	return;
}