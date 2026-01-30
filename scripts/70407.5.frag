// Simple Ray Tracer
// by Sam Belliveau

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M_PI (3.14159265358979323846)
#define torad(x) (float(x) * M_PI / float(180))

vec3  cam_pos = vec3(0, 0, 0);
float cam_pitch = -2.0 * M_PI * mouse.y;
float cam_yaw = -2.0 * M_PI * mouse.x;
float cam_fov = torad(90);

struct Object {
	vec3 pos;
	float size;
	vec4 color;
};

struct Ray {
	vec3 pos;
	vec3 dir;
	vec4 color;
};

float sum(vec3 v) {
	return v.x + v.y + v.z;
}

float mag(vec3 v) {
	return sqrt(sum(v * v));	
}

vec3 norm(vec3 v) {
	return v / mag(v); 	
}

vec4 normColor(vec4 v) {
	return v / v[3];	
}

vec3 getDirection(float pitch, float yaw) {
	float ps = sin( pitch );
	float pc = cos( pitch );
	float ys = sin( yaw );
	float yc = cos( yaw );
	
	return vec3( ys * pc , ps, yc * pc );
}

vec3 getPixelDirection(float x, float y) {
	vec3 cam_dir = getDirection(cam_pitch, cam_yaw);
	
	float delt = tan( cam_fov / 2.0 );
	
	vec3 y_delt =  delt * vec3(
		sin(torad(90) + cam_yaw),
		0,
		cos(torad(90) + cam_yaw)	
	);
	vec3 p_delt = delt * vec3(
		(0.0 - sin(cam_yaw)) * (sin(cam_pitch)),
		cos(cam_pitch),
		(0.0 - cos(cam_yaw)) * (sin(cam_pitch))
	);
	
	return norm(cam_dir + x * y_delt + y * p_delt);
}

Ray getPixelRay(float x, float y) {
	return Ray( cam_pos, getPixelDirection(x, y), vec4(0.0) );
}

float getDistance(Ray ray, Object obj) {
	vec3 dist = ray.pos - obj.pos;

	ray.dir = norm(ray.dir);
	float a = sum(ray.dir * ray.dir);
	float b = 2.0 * sum(dist * ray.dir);
	float c = sum(dist * dist) - (obj.size * obj.size);
	
	float d = (b * b - 4.0 * a * c);
	
	if(d < 0.0) return -1.0;
	
	d = ((-b - sqrt(d)) / (2.0 * a));
	
	if(d < 0.0) return -1.0;
	
	return d;
}

Ray updateRay(Ray ray, Object obj) {
	float dist = getDistance(ray, obj);
	ray.dir = norm(ray.dir);
	
	if(0.0 < dist) {
		ray.pos += ray.dir * dist;
		
		vec3 normal = norm(ray.pos - obj.pos);
		float dotvec = sum(normal * ray.dir);
		
		ray.dir -= 2.0 * dotvec * normal;
		ray.color += obj.color * (1.0 - ray.color[3]);
		return ray;
	} 


	return ray;
}

Ray finalize(Ray ray) {
	vec3 sun = getDirection(torad(80), torad(0));
	float brightness = max(0.0, sum(sun * ray.dir));
	vec4 sky = vec4(vec3(brightness), 1.0);
	ray.color += sky * (1.0 - ray.color[3]);
	return ray;
}

void main( void ) {
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	float w = resolution.x;
	float h = resolution.y;
	
	float cx = ((2./w)*x - 1.) * (w/h);
	float cy = -((2./h)*y - 1.);
	
	Ray r = getPixelRay(cx, cy);
	
	for(int i = 0; i < 16; ++i) {
		for(int tx = 5; tx <= 25; tx += 4) {
			for(int ty = -10; ty <= 10; ty += 4) {
				float rc = (float(tx) / 20.0) + 0.5;
				float gc = (float(ty) / 20.0) + 0.5;
				float bc = 1.0 - rc + gc;
				r = updateRay(r, Object(vec3(tx, 2.5 * sin((2.0 * time + float(tx)) / 5.0) + 2.5 * sin((3.0 * time + float(ty)) / 5.0) - 10.0, ty), 1.0, vec4(rc, gc, bc, 0.2)));
			}
		}		
	}
	
	r = finalize(r);
	
	gl_FragColor = normColor(r.color);
	//gl_FragColor = vec4(r.dir,1.0);

}