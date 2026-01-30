#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sphere_d(vec3 p){
	const vec3 sphere_pos = vec3(0.,0.,3.);
	const float r = 1.0;
	return length(p - sphere_pos) - r;
}

float qb_d(vec3 p){
	vec3 q = abs(p - vec3(0.,0.,3.));
	const float r = .5;
	return length(max(mod(q, 4.) - vec3(r,r,r),0.)) -0.5;
}

vec3 qb_normal(vec3 pos){
	float delta = 0.001;
	return normalize(vec3(
		qb_d(pos - vec3(delta, 0., 0.)) -qb_d(pos),
		qb_d(pos - vec3(0., delta, 0.)) -qb_d(pos),
		qb_d(pos - vec3(0., 0., delta)) -qb_d(pos)
		));
}
vec3 sphere_normal(vec3 pos){
	float delta = 0.001;
	return normalize(vec3(
		sphere_d(pos - vec3(delta, 0., 0.)) -sphere_d(pos),
		sphere_d(pos - vec3(0., delta, 0.)) -sphere_d(pos),
		sphere_d(pos - vec3(0., 0., delta)) -sphere_d(pos)
		));
}

struct Ray{
	vec3 pos;
	vec3 dir;
};

void main(void){
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec3 camera_pos = vec3(0., 7.0 * sin(time), -7.0 * cos(time) + 3.);
	vec3 camera_up  = normalize(vec3(sin(time * 0.3),cos(time),sin(time)));
	vec3 camera_dir = normalize(vec3(0.,-sin(time),cos(time)));
	vec3 camera_side= normalize(cross(camera_up, camera_dir));
	
	Ray ray;
	ray.pos = camera_pos;
	ray.dir = normalize(pos.x * camera_side + pos.y * camera_up + camera_dir);
	
	
	float t = 0.0, d;
	
	for(int i = 0; i < 64; i++){
		d = qb_d(ray.pos);
		
		if(d < 0.001) {
			break;
		}
		
		t += d;
		ray.pos = camera_pos + t * ray.dir;
	}
	
	vec3 L = normalize(vec3(.5,.3,1.));
	vec3 N = qb_normal(ray.pos);
	vec3 LColor = vec3(1.,1.,1.);
	vec3 I = dot(N, L) * LColor;
	
	if(d < 0.001){
		gl_FragColor = vec4(I,1.);
	}else{
		gl_FragColor = vec4(0);
	}
}