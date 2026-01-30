#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
	vec3 origin, direction;
};
			
struct Material{
	vec3 color;
	float ref_idx;
	int type;
};

struct Sphere{
	vec3 pos;
	float radius;
	Material mat;
};

struct Plane{
	vec3 pos;
	vec3 normal;
	Material mat;
};

struct Rect_xz{
	vec2 begin;
	vec2 end;
	vec3 normal;
	float k;
	Material mat;
};
	
struct Hit{
	bool isHit;
	float t;
	vec3 position, normal;
	Material mat;
};

struct Camera{
	vec3 center;
	float fov;
};

#define M_PI 3.1415926535897932384626433832795
const int Lambertian = 0;
const int Phong = 1;
const int BlinnPhong = 2;
const int Metal = 3;
const int Dielectric = 4;
const int Light = 5;

const Camera cam = Camera(vec3(0., 0., 0.), 90.0);
const Hit none_hit = Hit(false, 1000000.0, vec3(0.0), vec3(0.0), Material(vec3(0.0), 1., Lambertian));
const vec3 light_pos = vec3(0.0, 9.95, -10.0);
const vec3 light_color = vec3(0.88, 0.98, 0.94);

float seed = 1.0;

float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 generatePseudoRandomVector(int times){
	float rand1 = rand(vec2(times, seed));
	float rand2 = rand(vec2(seed, rand1));
	float rand3 = rand(vec2(rand1, seed));
	seed = rand(vec2(rand2, rand3));
	return vec2(rand(vec2(rand2, seed)), rand(vec2(seed, rand3)));
}

vec3 generatePseudoRandomSphere(int times){
	float rand1 = rand(vec2(times, seed));
	float rand2 = rand(vec2(seed, rand1));
	float rand3 = rand(vec2(rand1, seed));
	seed = rand(vec2(rand2, rand3));
	return vec3(rand(vec2(rand2, seed)), rand(vec2(seed, rand3)), rand(vec2(rand2, rand3)));
}

Ray get_ray(int times){
	vec2 xy = gl_FragCoord.xy - resolution/2.0 + generatePseudoRandomVector(times);
	float z = resolution.y/tan(radians(cam.fov) / 2.0) / 2.0;
	return Ray(cam.center, normalize(vec3(xy, -z)));
}

vec3 getNormal(vec3 center, vec3 point){
	return normalize(point-center);
}

vec3 getPosition(float t, Ray r){
	return r.origin + t*r.direction;
}

Hit checkIntersection(Ray r, Sphere s){
	vec3 oc = r.origin - s.pos;
	float b = dot(r.direction, oc);
	float c = dot(oc, oc) - s.radius*s.radius;
	float delta = b*b - c;
	
	if (delta <= 0.0){
		return none_hit;
	}
	
	float t = -b-sqrt(delta);
	if (t > 0.){
		vec3 pos = getPosition(t, r);
		vec3 normal = getNormal(s.pos, pos);
		return Hit(true, t, pos, normal, s.mat);
	}
	t = -b+sqrt(delta);
	if (t > 0.){
		vec3 pos = getPosition(t, r);
		vec3 normal = getNormal(s.pos, pos);
		return Hit(true, t, pos, normal, s.mat);
	}
	return none_hit;
}

Hit checkInteractionPlane(Ray r, Plane p){
	float d = dot(p.pos, p.normal);
	float t = (d - dot(r.origin, p.normal))/dot(r.direction, p.normal);
	if (t <= 0.0){
		return none_hit;
	}
	vec3 hit_pos = r.origin + t*r.direction;
	return Hit(true, t, hit_pos, p.normal, p.mat);
}	
	
Hit checkInteractionRectXZ(Ray r, Rect_xz xz){
	float t = (xz.k - r.origin.y)/r.direction.y;
	if (t < 0.0){
		return none_hit;
	}
	vec3 hit_pos = r.origin + t*r.direction;
	if (hit_pos.x < xz.begin.x || xz.end.x < hit_pos.x){
		return none_hit;
	}
	if (hit_pos.z < xz.begin.y || xz.end.y < hit_pos.z){
		return none_hit;
	}
	return Hit(true, t, hit_pos, xz.normal, xz.mat);
}

#define numOfSpheres 5
#define numOfPlanes 6
#define numOfLights 1
#define spp 4
#define max_path 4
#define bias 0.0001
Sphere sphere[numOfSpheres];
Plane plane[numOfPlanes];
Rect_xz light[numOfLights];

Hit intersectionCheck(Ray r){
	Hit nearestHit = none_hit;
	for (int i = 0; i < numOfSpheres; i++){
		Hit hit = checkIntersection(r, sphere[i]);
		if (hit.isHit){
			if (hit.t < nearestHit.t){
				nearestHit = hit;
			}
		}
	}
	for (int i = 0; i < numOfPlanes; i++){
		Hit hit = checkInteractionPlane(r, plane[i]);
		if (hit.isHit){
			if (hit.t < nearestHit.t){
				nearestHit = hit;
			}
		}
	}
	for (int i = 0; i < numOfLights; i++){
		Hit hit = checkInteractionRectXZ(r, light[i]);
		if (hit.isHit){
			if (hit.t < nearestHit.t){
				nearestHit = hit;
			}
		}
	}
	return nearestHit;
}

bool checkShadow(Hit hit){
	vec3 hitPoint = hit.position + bias*hit.normal;//avoid self-intersection
	Ray r = Ray(hitPoint, normalize(light_pos-hitPoint));
	Hit shadow_hit = intersectionCheck(r);
	return shadow_hit.isHit;
}

vec3 shade(Hit hit);
vec3 shadeLambertian(Hit hit);
vec3 shadePhong(Hit hit);
vec3 shadeBlinnPhong(Hit hit);
vec3 shadeMetal(Hit hit);
vec3 shadeDielectric(Hit hit);

	
float fresnel(vec3 _in, vec3 _out, vec3 normal, float eta){
	float cos_in = abs(dot(_in, normal));
	float cos_out = abs(dot(_out, normal));
	if (eta*eta*(1.-cos_in*cos_in)>=1.){
		return 1.;
	}
	float rs = (eta*cos_in-cos_out)/(eta*cos_in+cos_out);
	float rt = (eta*cos_out-cos_in)/(eta*cos_out+cos_in);
	return (rs*rs+rt*rt)/2.;
}

vec3 shadeBlinnPhong(Hit hit){
	float light_dis = distance(light_pos, hit.position);
	Hit shadowHit = intersectionCheck(Ray(hit.position + bias*hit.normal, normalize(light_pos - hit.position)));
	if (shadowHit.isHit && shadowHit.t <= light_dis){
		return vec3(0.);
	}
	
	vec3 L_d = vec3(0.);
	
	float ka = 0.1;
	float kd = 1.0;
	float ks = 0.5;
	
	vec3 ambient = ka*light_color;
	
	vec3 light = normalize(light_pos - hit.position);
	vec3 view = normalize(cam.center - hit.position);
	vec3 ref = reflect(-view, hit.normal);
	vec3 hal = normalize(light+view);
	
	vec3 diffuse = kd*clamp(dot(light, hit.normal), 0.0, 1.0)*light_color;
	vec3 specular = ks*pow(clamp(dot(hal, hit.normal), 0.0, 1.0), 256.0)*light_color;
	L_d = (ambient+diffuse+specular)*hit.mat.color;
	
	return L_d;
}

vec3 shadeMetal(Hit hit){//reflection
	vec3 L = vec3(0.);
	vec3 L_d = shadeBlinnPhong(hit);//divide L into direct illumination and indirect illumination
	vec3 L_id = vec3(0.);
	vec3 sum = hit.mat.color;
	for (int i = 0; i < max_path; i++){//it semms that glsl doesn't suppor recursion, using loop instead
		
		vec3 view = normalize(cam.center - hit.position);
		vec3 ref = reflect(-view, hit.normal);
		
		Ray r = Ray(hit.position + bias*hit.normal, ref);
		hit = intersectionCheck(r);
		sum *= hit.mat.color;
	 
		L_id += shadeBlinnPhong(hit)*sum;
		
	}
	
	L = L_d + L_id;
	return L;
}

vec3 shadeDielectric(Hit hit){//reflection and refraction
	return vec3(0.);
	/*vec3 L = vec3(0.);
	vec3 L_d = shadeBlinnPhong(hit);
	vec3 L_id = vec3(0.);
	vec3 L_t = vec3(0.);
	vec3 sum = hit.mat.color;
	for (int i = 0; i < max_path; i++){
		
		vec3 view = normalize(cam.center - hit.position);
		vec3 ref = reflect(-view, hit.normal);
		float isOutside = step(0.0, dot(ref, hit.normal));
		vec3 rfr = refract(-view, hit.normal, isOutside*hit.mat.ref_idx+(1-isOutside)/hit.mat.ref_idx);
		
		Ray r = Ray(hit.position + bias*hit.normal, ref);
		hit = intersectionCheck(r);
		sum *= hit.mat.color;
	 
		L_id += shadeBlinnPhong(hit)*sum;
		
	}
	
	L = L_d + L_id + L_t;
	return L;*/
}

vec3 shade(Hit hit){
	if (hit.mat.type == BlinnPhong){
		return shadeBlinnPhong(hit);
	}else if (hit.mat.type == Metal){
		return shadeMetal(hit);
	}else if (hit.mat.type == Dielectric){
		return shadeDielectric(hit);
	}
}

Ray scatter(Hit hit, Ray ir, int times){
	//todo: return a new ray
	if (hit.mat.type == Metal){//simply reflect it
		vec3 ref = reflect(ir.direction, hit.normal);
		return Ray(hit.position + bias*hit.normal, normalize(ref+generatePseudoRandomSphere(times)));
	}
	else if (hit.mat.type == Dielectric){
		//todo
	}else if (hit.mat.type == Lambertian){
		vec3 random_sphere = generatePseudoRandomSphere(times);
		vec3 target = hit.position + hit.normal + random_sphere;
		return Ray(hit.position + bias*hit.normal, normalize(target - hit.position));
	}
}

vec3 color(Ray r){//in path tracing, we tends to use recursion, however it is not allowed in glsl, we use loops instead
	vec3 color = vec3(0.);
	vec3 attenuation = vec3(1.);
	for (int i = 0; i < max_path; i++){
		Hit hit = intersectionCheck(r);
		if (hit.isHit){
			if (hit.mat.type == Light){
				return attenuation*hit.mat.color;
			}
			attenuation*=hit.mat.color;
			r = scatter(hit, r, i);
		}else{
			return vec3(0.);
		}
	}
	return attenuation;
}

void main( void ) {
	
	Material white = Material(vec3(1.0, 1.0, 1.0), 1.65, Lambertian);
	Material red = Material(vec3(1., 0., 0.), 1.65, Lambertian);
	Material blue = Material(vec3(0., 0., 1.), 1.65, Lambertian);
	Material metal = Material(vec3(1., 0.8, 0.9), 1.65, Metal);
	Material yellow = Material(vec3(1., 1., 0.), 1.65, Lambertian);
	
	sphere[0] = Sphere(vec3(-10., -5., -15.), 2., metal);
	/*sphere[0] = Sphere(vec3(-5., 3.*cos(time*1.2)+3., -20.+5.*sin(time*1.2)),4., green);
	sphere[1] = Sphere(vec3(-25., 8., -30.), 8., pink);
	sphere[2] = Sphere(vec3(5.0*cos(time*0.75)+15.0, 9.5, 5.*sin(time*0.75)-30.0), 5., yellow);
	sphere[3] = Sphere(vec3(0., -105., -20.), 100., white);
	sphere[4] = Sphere(vec3(10.+5.*cos(time), -1., -10.+1.*cos(time)), 2., lightblue);*/
	
	plane[0] = Plane(vec3(0., 0., 0.), vec3(0., 0., -1.), white);
	plane[1] = Plane(vec3(0., 0., -25.), vec3(0., 0., 1.), white);
	plane[2] = Plane(vec3(20., 0., 0.), vec3(-1., 0., 0.), blue);
	plane[3] = Plane(vec3(-20., 0., 0.), vec3(1., 0., 0.), red);
	plane[4] = Plane(vec3(0., 15., 0.), vec3(0., -1., 0.), white);
	plane[5] = Plane(vec3(0., -15., 0.), vec3(0., 1., 0.), white);
	
	light[0] = Rect_xz(vec2(-5., -20.), vec2(5., -15.), vec3(0., -1., 0.), 14.95, white);
	
	vec3 sum_color = vec3(0.);
	for (int i = 0; i < spp; i++){//utilize more than 1 sample to anti alias
		Ray ray = get_ray(i);//get a ray from camera, adding randomness for aa

		sum_color += color(ray);
	}
	
	gl_FragColor = vec4(sum_color/float(spp), 1.0);



	/*vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );*/

}