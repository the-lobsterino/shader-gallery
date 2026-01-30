#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

struct Ray {
	vec3 origin;
	vec3 dir;
};
	
struct Light {
	vec3 p;
};

struct Plane {
	vec3 n;
	vec3 p;
	vec3 col;
};

struct Sphere {
	vec3 c;
	float r;
	vec3 col;
};

struct Hit {
	float t;
	vec3 col;
	Ray refray;
};

const vec3 c_up = vec3(0, -5, 0.0);
const vec3 c_from = vec3(0, 0, -100.0);
const vec3 c_to = vec3(0.0, 0.0, 0.0);
const float dist = 2.0;

Ray genRay( vec2 pixel ) {
	Ray r;
	vec3 w = normalize(c_from - c_to);
	vec3 u = normalize(cross(c_up, w));
	vec3 v = cross(w, u);
	vec3 e = c_from;
	vec3 p = pixel.x * u + pixel.y * v + dist * w + e;
	r.origin = e;
	r.dir = normalize(r.origin - p);
	return r;
}

bool interSphere(Sphere s, Ray r, inout Hit h) {
	float a = dot(r.dir, r.dir);
	float hb = dot(r.dir, r.origin - s.c);
	float c = dot(r.origin - s.c, r.origin - s.c) - s.r*s.r;
	if(hb*hb - a*c > 0.0) { 
		float x1 = (-hb + sqrt(hb*hb - a*c))/a;
		float x2 = (-hb - sqrt(hb*hb - a*c))/a;
		h.col = s.col;
		if(max(x1, x2) < 0.) { 
			return false;
		}
		h.t = min(x1, x2);
		h.refray.origin = r.origin + h.t * r.dir;
		h.refray.dir = (h.refray.origin - s.c)/s.r;
		if(min(x1, x2) < 0.) { 
			h.t = max(x1, x2) ;
			h.refray.origin = r.origin + h.t * r.dir;
			h.refray.dir = -(h.refray.origin - s.c)/s.r;
		}
		return true;
	}
	return false;
}

bool interPlane(Plane p, Ray r, inout Hit h) {
	float t = - dot(p.n, r.origin - p.p) / dot(p.n, r.dir);
	if(t >= 0.) { 
		h.t = t;
		h.refray.dir = p.n;
		h.refray.origin = r.origin + t * r.dir;
		h.col = p.col;
		return true;
	}
	return false;
}

void inters(Ray ray, inout Hit h) {
	Light l;
	l.p = normalize(vec3(1.0,1.0,1.0));
	
	Sphere sun;
	sun.c = vec3(0,0,0);
	sun.col = vec3(2,2,0);
	sun.r = 7.0;
	
	Sphere mercury;
	mercury.c = vec3(9.*-sin(1.5*time),0,-9.*cos(1.5*time));
	mercury.r = 0.38;
	mercury.col = vec3(0.5,0.5,0.5);
	
	Sphere venus;
	venus.c = vec3(15.*-sin(0.3*time),0,-15.*cos(0.3*time));
	venus.r = 0.95;
	venus.col = vec3(1,1,1);
	
	Sphere earth;
	earth.c = vec3(20.*-sin(0.2*time),0,-20.*cos(0.2*time));
	earth.r = 1.0;
	earth.col = vec3(1,1,4);
	
	Sphere moon;
	moon.c = vec3(20.*-sin(0.2*time), 0 ,-20.*cos(0.2*time)) + vec3(1.5*sin(2.4*time), 0,1.5* cos(2.4*time));
	moon.r = 0.2;
	moon.col = vec3(0.9,0.9,0.9);
	
	Sphere mars;
	mars.c = vec3(30.*-sin(0.1*time),0,-30.*cos(0.1*time));
	mars.r = 0.53;
	mars.col = vec3(4,0.5,0.5);
	
	Sphere jupyter;
	jupyter.c = vec3(40.*-sin(0.02*time),0,-40.*cos(0.02*time));
	jupyter.r = 2.0;
	jupyter.col = vec3(0.7,0.5,0.5);
	
	Sphere saturn;
	jupyter.c = vec3(40.*-sin(0.01*time),0,-40.*cos(0.01*time));
	jupyter.r = 1.8;
	jupyter.col = vec3(0.5,0.5,0.1);
	
	Sphere uranus;
	saturn.c = vec3(45.*-sin(0.006*time),0,-45.*cos(0.006*time));
	saturn.r = 1.5;
	saturn.col = vec3(0.1,0.5,0.5);
	
	Sphere neptune;
	neptune.c = vec3(50.*-sin(0.004*time),0,-50.*cos(0.004*time));
	neptune.r = 1.45;
	neptune.col = vec3(0.1,1.5,1.5);
	
	Sphere around;
	around.c = vec3(0);
	around.r = 200.;
	around.col = vec3(0.3,0.3,0.3);
	
	Sphere sps[11];
	sps[0] = sun;
	sps[1] = mercury;
	sps[2] = venus;
	sps[3] = earth;
	sps[4] = moon;
	sps[5] = mars;
	sps[6] = jupyter;
	sps[7] = saturn;
	sps[8] = uranus;
	sps[9] = neptune;
	sps[10] = around;
	
	Plane plane;
	plane.col = vec3(4,4,4);
	plane.n = normalize(vec3(0,1,0));
	plane.p = vec3(0,-30,0);

	h.t = 1./0.;
	Ray tray;
	Hit th;
	
	bool isReflect = false;

	for(int j=0; j<11; j++) {
		if(interSphere(sps[j], ray, th)) {
			if(th.t < h.t) {
				tray = th.refray;
				h = th;
			}
		}
	}

	if(interPlane(plane, ray, th)) {
		if(th.t < h.t) {
			tray = th.refray;
			h = th;
			isReflect = true;
		}
	}
	
	if(isReflect){
		for(int j=0; j<11; j++) {
			if(interSphere(sps[j], tray, th)) {
				if(th.t < h.t) {
					h = th;
				}
			}
		}
	}

	h.col *= clamp(dot(h.refray.dir, l.p), 0.2, 1.);		
}
	
void main( void ) {
	vec2 p  = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	Ray ray = genRay(p);
	Hit h;
	inters(ray, h);
	gl_FragColor = vec4(h.col, 1.0);
}