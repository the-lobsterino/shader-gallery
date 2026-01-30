#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define NUM_SPHERE 4
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
struct Ray{
	vec3 origin;
	vec3 direction;
};
struct Intersect{
	vec3 point;
	vec3 normal;
	vec3 color;
	bool hit;
	float t;
};
struct Sphere{
	float r;
	vec3 center;
	vec3 color;
};
Sphere spheres[NUM_SPHERE];
const float PI = 3.141592;
vec3 camera_e;
vec3 camera_up;
vec3 camera_w;
vec3 camera_u;
vec3 camera_v;
vec3 light_pos;
Intersect intersect_sphere(Ray ray,Sphere sphere,float mint){
	Intersect intersect;
	intersect.hit = false;
	intersect.t = mint;
	intersect.color = vec3(0,0,0);
	vec3 oc = ray.origin - sphere.center;
	float b = dot(ray.direction,oc);
	float c = dot(oc,oc)-sphere.r*sphere.r;
	float D = b*b -c;
	if (D > 0.0) {
		float t = -b-sqrt(D);
		if(t > 0.0&& t < mint){//正負一つずつある場合は考えない。
			intersect.point = ray.origin + ray.direction*t;
			intersect.normal = (intersect.point - sphere.center)/sphere.r;
			float d = min(dot(normalize(light_pos-intersect.point),intersect.normal),1.0);
			float r = distance(light_pos,intersect.point);
			intersect.color = 200.0*sphere.color*d/(4.0*PI*r*r);
			intersect.t = mint;
			intersect.hit = true;
		}
	}
	return intersect;
}
Intersect intersect_sphere_ref(Ray ray,Sphere sphere,float mint){
	Intersect intersect;
	intersect.hit = false;
	intersect.t = mint;
	intersect.color = vec3(0,0,0);
	vec3 oc = ray.origin - sphere.center;
	float b = dot(ray.direction,oc);
	float c = dot(oc,oc)-sphere.r*sphere.r;
	float D = b*b -c;
	if (D > 0.0) {
		float t = -b-sqrt(D);
		if(t > 0.0&& t < mint){//正負一つずつある場合は考えない。
			intersect.point = ray.origin + ray.direction*t;
			intersect.normal = (intersect.point - sphere.center)/sphere.r;
			vec3 wi = -light_pos+intersect.point;
			vec3 wr = -2.0*dot(wi,intersect.normal)*intersect.normal + wi;
			Ray ray2;
			ray2.origin = intersect.point-ray.direction*0.001;
			ray2.direction = normalize(wr);
			Intersect ninter;
			float mint2 = 1e9;
			bool hit = false;
			for(int i = 0;i<NUM_SPHERE;i++){
				Intersect nintersect = intersect_sphere(ray2,spheres[i],mint2);
				if(nintersect.hit){
					mint2 = nintersect.t;
					ninter = nintersect;
					hit = true;
				}
			}
			if (!hit){
				float d = min(dot(normalize(light_pos-intersect.point),intersect.normal),1.0);
				float r = distance(light_pos,intersect.point);
				intersect.color = 200.0*sphere.color*d/(4.0*PI*r*r);
				intersect.t=mint;
				intersect.hit = true;
			}else{
				intersect.color = 1.0*ninter.color;
				intersect.t = mint;
				intersect.hit = true;
			}
		}
	}
	return intersect;
}

void main( void ) {
	spheres[1] =  Sphere(1.0, vec3(-2.0, -1.0, 12.0), vec3(0.5, 1.0, 1.0));
  	spheres[2] =  Sphere(1.0,  vec3(-2.0, 0.0, 3.0), vec3(1.0, 1.0, 0.5));
  	spheres[0] =  Sphere(1.0,  vec3(2.0, -1.0, 8.0), vec3(1.0, 1.0, 1.0));
	spheres[3] =  Sphere(1.0,  vec3(2.0, 1.0, 12.0), vec3(1.0, 3.0, 1.0));
	vec2 position = ( gl_FragCoord.xy*2.0 -resolution)/ max(resolution.x, resolution.y);//中心(0,0),[-1,1]
	camera_e = vec3(mouse.x*14.0-5.0,mouse.y*14.0-5.,0); 
	camera_up = normalize(vec3(0,-1,0));
	camera_w = normalize(vec3(0,0,1));
	camera_u = normalize(cross(camera_up,camera_w));
	camera_v = cross(camera_w,camera_u);
	light_pos = vec3(0,0,2);
	vec3 color=vec3(0,0,0);
	Ray ray;
	ray.origin = camera_e;
	ray.direction = normalize(position.x *camera_u+position.y*camera_up+camera_w);
	float mint = 1e9;
	for(int i = 0;i<NUM_SPHERE;i++){
		Intersect intersect = intersect_sphere_ref(ray,spheres[i],mint);
		mint = intersect.t;
		if(intersect.hit){
			color = intersect.color;
		}
		
	}
	
	gl_FragColor=vec4(color,1.0);
}