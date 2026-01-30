//www.Minecraft.com/

// I read these codes and implement this glslsandbox version
// http://www.kevinbeason.com/smallpt/

// http://kagamin.net/hole/edupt/index.htm
// https://github.com/githole/edupt
// path tracing written by Kazutaka Nakashima (n-taka.info)
#define SUPER_SAMPLE_RATIO 6
#define SAMPLE_NUM 1
#define DEPTH_MAX 5
#define OLD_RATIO (0.995)

// set this parameter 'true'
// I recomend to set the parameter (you will see upper left of this code) 4 or 8
bool reset = true;
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// before 5 times bounce, we do not perform russian roulette
#define RUSSIAN_ROULETTE_MAX 5

// material definition
#define DIFF 0
#define SPEC 1
#define REFR 2

// struct definition
struct Ray     { vec3 o; vec3 d; };
struct Sphere  { float r; vec3 p; vec3 e; vec3 c; int m; };
struct HitInfo { float t; int id; vec3 P; vec3 N; Sphere s; };

// cornell box is represented as 9 spheres original is from smallpf
Sphere spheres[9];

// background color
vec3 background = vec3(0.5,0.5,0.5);

// parameter
float eps=1e-4;
float M_PI = 3.14159265358979323846264338327950288;




// make cornell box (http://kagamin.net/hole/edupt/index.htm)
void init_spheres( void ){
	spheres[0] = Sphere(  1e5, vec3(   1e5+1.,      40.8,      81.6), vec3(  0.,  0.,  0.), vec3(  .75,  .25,  .25), DIFF); // left
	spheres[1] = Sphere(  1e5, vec3( -1e5+99.,      40.8,      81.6), vec3(  0.,  0.,  0.), vec3(  .25,  .25,  .75), DIFF); // right
	spheres[2] = Sphere(  1e5, vec3(      50.,      40.8,       1e5), vec3(  0.,  0.,  0.), vec3(  .25,  .75,  .25), DIFF); // back
	spheres[3] = Sphere(  1e5, vec3(      50.,      40.8, -1e5+250.), vec3(  0.,  0.,  0.), vec3(   0.,   0.,   0.), DIFF); // front
	spheres[4] = Sphere(  1e5, vec3(      50.,       1e5,      81.6), vec3(  0.,  0.,  0.), vec3(  .75,  .75,  .75), DIFF); // bottom
	spheres[5] = Sphere(  1e5, vec3(      50., -1e5+81.6,      81.6), vec3(  0.,  0.,  0.), vec3(  .75,  .75,  .75), DIFF); // top
	spheres[6] = Sphere( 16.5, vec3(      27.,      16.5,       47.), vec3(  0.,  0.,  0.), vec3( .999, .999, .999), DIFF); // mirror
	spheres[7] = Sphere( 16.5, vec3(      73.,      16.5,       78.), vec3(  0.,  0.,  0.), vec3( .999, .999, .999), DIFF); // grass
	spheres[8] = Sphere(  15., vec3(      50.,       90.,      81.6), vec3( 36., 36., 36.), vec3(   0.,   0.,   0.), DIFF); // light
}

// original code from http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 co){
	return fract(sin(dot(co.xy*vec2(sin(time),cos(time)) ,vec2(12.9898,78.233))) * 43758.5453);
}

float clamp01(float x){ 
	if (x < 0.0)
		return 0.0;
	if (x > 1.0)
		return 1.0;
	return x;
}

float tone_map(float x){
	return clamp01(x);
//	return pow(clamp01(x), 1.0/2.2);
}

vec4 tone_mapvec4(vec4 x){
	return vec4(tone_map(x[0]),tone_map(x[1]),tone_map(x[2]),x[3]);
}

// this function returns the information of hit point (if there is no intersection, HitInfo.id == -1)
// linear search (#spheres is small, linear search is fast enough)
HitInfo intersect( Ray r ){
	HitInfo hit = HitInfo(0.0,-1,vec3(0.,0.,0.),vec3(0.,0.,0.),spheres[0]);
	
	for(int i=0;i<9;++i){
		vec3 to_center = spheres[i].p - r.o;
		float b=dot(to_center,r.d);
		float det=b*b-dot(to_center,to_center)+spheres[i].r*spheres[i].r; 
		if(det < 0.0){
			continue;
		}else{
			float sqrt_det = sqrt(det);
			float t1 = b - sqrt_det;
			float t2 = b + sqrt_det;
			if(t1 < eps && t2 < eps){
				continue;
			}else{
				if(t1 > eps){
					if(hit.id < 0 || hit.t > t1){
						hit.t = t1;
						hit.P = r.o + hit.t * r.d;
						hit.N = normalize(hit.P - spheres[i].p);
						hit.id = i;
						hit.s = spheres[i];
					}
				} else {
					if(hit.id < 0 || hit.t > t2){
						hit.t = t2; 
						hit.P = r.o + hit.t * r.d;
						hit.N = normalize(hit.P - spheres[i].p);
						hit.id = i;
						hit.s = spheres[i];
					}
				}
			}
		}
	}
	return hit;
}



vec3 radiance( Ray r ){
	
	int depth = 0;

	Ray current = r;
	HitInfo hit = intersect(current);
	if(hit.id < 0) return background; // if there is no intersection
/*
	if(hit.id == 0) return spheres[0].c; // if there is no intersection
	if(hit.id == 1) return spheres[1].c; // if there is no intersection
	if(hit.id == 2) return spheres[2].c; // if there is no intersection
	if(hit.id == 3) return spheres[3].c; // if there is no intersection
	if(hit.id == 4) return spheres[4].c; // if there is no intersection
	if(hit.id == 5) return spheres[5].c; // if there is no intersection
	if(hit.id == 6) return spheres[6].c; // if there is no intersection
	if(hit.id == 7) return spheres[7].c; // if there is no intersection
	if(hit.id == 8) return spheres[8].c; // if there is no intersection
*/
	
	
	vec3 orienting_normal = dot(hit.N , current.d) < 0.0 ? hit.N:(-1.0 * hit.N);
	// get max color
	float russian_roulette_p = (hit.s.c.x>hit.s.c.y && hit.s.c.x>hit.s.c.z)? hit.s.c.x:((hit.s.c.y>hit.s.c.z)? hit.s.c.y:hit.s.c.z);
	vec3 accumulated_radiance = vec3(0.,0.,0.);
	vec3 incoming_radiance;
	vec3 dir;
	vec3 prev_weight = vec3(1.,1.,1.);
	
	
	for(int a=1;a>0;++a){
		// GLSL does not allow recursive call. we loop infinitely untill rossian roulette terminates this function
		// we trace just 1 ray at once (if the material is glass, we decide which ray(reflect or refract) we trace with russian roulette)
		if (depth > DEPTH_MAX)
			russian_roulette_p = russian_roulette_p * pow(0.5, float(depth - DEPTH_MAX));
		if (depth > RUSSIAN_ROULETTE_MAX){
			if (rand(vec2(r.o.x,r.o.y)) >= russian_roulette_p) { break; }
		} else {
			russian_roulette_p = 1.0;
		}
	
	
		if(hit.s.m == DIFF){
			// diffusion
			vec3 w,u,v;
			w = orienting_normal;
			if(sqrt(w.x*w.x) > eps){
				u = normalize(cross(vec3(0.,1.,0.),w));
			}else{
				u = normalize(cross(vec3(1.,0.,0.),w));
			}
			v = cross(w,u);
			float r1 = 2. * M_PI * rand(vec2(w.x,w.y));
			float r2 = rand(vec2(u.x,u.y));
			float r2s = sqrt(r2);
			dir = normalize(u*cos(r1)*r2s + v*sin(r1)*r2s + w*sqrt(1.-r2));
		}else if(hit.s.m == SPEC){
			// specular reflection
		}else if(hit.s.m == REFR){
			// specular refraction
		}else{
			// this condition is expected not to happen
		}

		depth = depth + 1;
		
		// accumulate radiance of this bounce
		accumulated_radiance = accumulated_radiance + prev_weight*hit.s.e;
		prev_weight = prev_weight * (hit.s.c / russian_roulette_p);
		
		
		// prepare next trace
		Ray current = Ray(hit.P+dir*0.02,dir);
		hit = intersect(current);
		if(hit.id < 0) break; // if there is no intersection
		orienting_normal = dot(hit.N , current.d) < 0.0 ? hit.N:(-1.0 * hit.N);
		// get max color
		russian_roulette_p = (hit.s.c.x>hit.s.c.y && hit.s.c.x>hit.s.c.z)? hit.s.c.x:((hit.s.c.y>hit.s.c.z)? hit.s.c.y:hit.s.c.z);
	}

	return accumulated_radiance;
}

void main( void ) {
	if(reset){
		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
		return;
	}

	init_spheres();
	vec3 camera_pos = vec3(50.,52.,220.);
	vec3 camera_dir = normalize(vec3(0.,-0.04,-1.0));
	vec3 camera_up  = normalize(vec3(0.0, 1.0, 0.0));
	
		
	float width = resolution.x;
	float height = resolution.y;
	
	vec2 pos = gl_FragCoord.xy;
	
	// screen size
	float screen_width = 30.0 * width / height;
	float screen_height= 30.0;
	// distance to screen
	float screen_dist  = 40.0;
	// vectors along with screen x, y
	vec3 screen_x = normalize(cross(camera_dir, camera_up)) * screen_width;
	vec3 screen_y = normalize(cross(screen_x, camera_dir)) * screen_height;
	vec3 screen_center = camera_pos + camera_dir * screen_dist;

	
	
	vec3 accumulated_radiance = vec3(0.,0.,0.);
	vec3 accumulated_radiance_for_pix = vec3(0.,0.,0.);
	
	for(int sx=0;sx<SUPER_SAMPLE_RATIO;++sx){
		for(int sy=0;sy<SUPER_SAMPLE_RATIO;++sy){
			accumulated_radiance_for_pix = vec3(0.,0.,0.);
			for(int j=0;j<SAMPLE_NUM;++j){
				float rate = (1.0 / float(SUPER_SAMPLE_RATIO));
				float r1 = float(sx) * rate + rate / 2.0;
				float r2 = float(sy) * rate + rate / 2.0;
				// position of pixel on screen
				vec3 screen_pos = screen_center + screen_x * ((r1 + pos.x) / width - 0.5) + screen_y * ((r2 + pos.y) / height- 0.5);
				// camera
				vec3 dir = normalize(screen_pos - camera_pos);
				
				accumulated_radiance_for_pix = accumulated_radiance_for_pix + 
							radiance(Ray(camera_pos, dir))/float(SAMPLE_NUM)/(float(SUPER_SAMPLE_RATIO)*float(SUPER_SAMPLE_RATIO));
			}
			accumulated_radiance = accumulated_radiance + accumulated_radiance_for_pix;
		}
	}

	// in glslsandbox, color is represented in 0.0-1.0 (if larger than 1.0, it is considered as 1.0)
	vec4 old_color = texture2D(backbuffer, pos/resolution);
	vec4 current_color = vec4(accumulated_radiance, 1.0);
	gl_FragColor = (old_color*OLD_RATIO + current_color*(1.0-OLD_RATIO));
}


