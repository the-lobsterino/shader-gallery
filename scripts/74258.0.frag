

#ifdef GL_ES
precision mediump float;
#endif
uniform samplerCube envmap;
bool cam_move = false;
float det( vec3 a, vec3 b, vec3 c ) {
    return (a.x * b.y * c.z)
            + (a.y * b.z * c.x)
            + (a.z * b.x * c.y)
            - (a.x * b.z * c.y)
            - (a.y * b.x * c.z)
            - (a.z * b.y * c.x);
}
vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D aa;
int obj = 0;


struct Sphere
{
	vec3 center;
	float radius;
	vec3 color;
	bool mirror;
	bool glass;
};
struct Plane
{
	vec3 a;
	vec3 b;
	vec3 c;
	vec3 color;
	bool light;
};
float size = 0.8;
float y_light_plane = 0.8;
Plane plane_light = Plane(vec3(-size,y_light_plane, size),  vec3(size,y_light_plane, size), vec3(-size,y_light_plane, -size), vec3(0,1,0), true);
float light_intensity = 20000.0;
Sphere Sphere_ = Sphere(vec3(0.0,0.0,0.0), 0.4, vec3(1,0.2,0.2), false, false);
Sphere Sphere_2 = Sphere(vec3(0.7, 0.7, 0.7), 0.1, vec3(0.5, 0.5, 1), false, false);
Sphere Sphere_3 = Sphere(vec3(0.5, 0.0, 1.7), 0.1, vec3(0.5, 1, 1), false, false);
Sphere light = Sphere(20.0*vec3(1.0,1.0,1.0), 5.0, vec3(0.5, 0.5, 1), false, false);

Plane plane1 = Plane(vec3(-1.5,1,-1),  vec3(1.5,1,-1), vec3(-1.5,-1,-1), vec3(0.05 ,0.3,0.5), false);
Plane plane2 = Plane(vec3(-1.5,1,-1), vec3(-1.5,-1,-1),  vec3(-1.5,1,1), vec3(0.8, 0.1,0.1), false);
Plane plane3 = Plane(vec3(1.5,1,-1)  ,vec3(1.5,1,1), vec3(1.5,-1,-1), vec3(0.9,0.1,0.1), false);
Plane plane4 = Plane(vec3(-1.5,1,-1),  vec3(-1.5,1,1), vec3(1.5,1,-1), vec3(0.1,0.7,0.1), false);
Plane plane5 = Plane(vec3(-1.5,1,1),  vec3(-1.5,-1,1), vec3(1.5,1,1), vec3(0.5,0.5,0.5), false);
vec3 lightDir(vec3 pos)
{
	//return normalize(vec3(-1.0, 1.0, 1.0));
	return light.center - pos;
}
struct Intersect
{
	float t;
	float t2;
	vec3 normal;
	vec3 position;
	vec3 color;
	bool mirror;
	bool glass;
	vec3 normal2;
	bool hit_light;
	int hit_num;
};
void Sphere_intersect(vec3 cur, vec3 ray, Sphere Sphere, inout Intersect nearest);
void exec_intersects(vec3 cur, vec3 ray, inout Intersect i);

void Sphere_intersect(vec3 cur, vec3 ray, Sphere Sphere, inout Intersect nearest)
{
	float a = dot(ray, ray);
	float b = 2.0 * dot(ray, cur - Sphere.center);
	float c = dot(cur - Sphere.center,cur - Sphere.center ) - Sphere.radius*Sphere.radius;
	float tmp = b*b - 4.0 * a * c;
	if(tmp<0.0) {
		return;
	}
	else{
		float t = -b/(2.0*a) - sqrt(tmp);
		float t2 = -b/(2.0*a) + sqrt(tmp);
		if(t >= 0.0001){
			if((nearest.t > t || nearest.t < 0.0)) {
				nearest.t = t;
				nearest.normal = normalize(cur+ray*t - Sphere.center);
				//float  diff = dot(nearest.normal, lightDir(cur+ray*t));
				float diff = light_intensity*dot(nearest.normal, normalize(lightDir(cur+ray*t)))/(4.0*3.14*length(lightDir(cur+ray*t))*length(lightDir(cur+ray*t)));
				//nearest.color = diff * Sphere.color + vec3(0.1);
				nearest.color=Sphere.color;
				nearest.mirror = Sphere.mirror;
				nearest.glass = Sphere.glass;
				nearest.hit_num += 1;
			}			
		}
		else{
			if(nearest.t2 > t2 || nearest.t2 < 0.0) {
				nearest.t2 = t2;
				nearest.normal2 = normalize(cur+ray*t2 - Sphere.center);
			}
			
		}
	}
}
void plane_intersect(vec3 cur, vec3 ray, inout Intersect n)
{
	float plane_y = -1.0;
	float t = -1.0;
	if(ray.y != 0.0) t = (plane_y - cur.y)/ray.y;
	
	if(0.000 <= t && t < 1000.0) {
		if(n.t > t || n.t < 0.0) {
			n.t = t;
			n.normal = vec3(0,1,0);			
			vec3 pos = cur + ray * t;
			float diff = light_intensity*dot(n.normal, normalize(lightDir(pos)))/(4.0*3.14*length(lightDir(pos))*length(lightDir(pos)));
			vec3 col = vec3(0.7,0.7,0.7);
			if(mod(pos.x, 2.0) < 1.0 && mod(pos.z, 2.0) < 1.0 || mod(pos.x, 2.0) > 1.0 && mod(pos.z, 2.0) > 1.0) col = vec3(0.2);
			n.color = diff * col + vec3(0.1);
			n.hit_num += 1;
		}
		return;
	}	
	
}
void plane_intersect2(vec3 cur, vec3 ray, Plane p, inout Intersect nearest)
{	
	vec3 a_ = p.a; vec3 b_ = p.b; vec3 c_ = p.c;
	float det_div = det(a_ - b_, a_ - c_, ray);
	float det_t = det(a_ - b_, a_ - c_, a_ - cur);
	float det_beta = det(a_ - b_, a_ - cur, ray);
	float det_gamma = det(a_ - cur, a_ - c_, ray);
	//nearest.t = -1.0;
	if(det_div == 0.0) return;
	if(det_t/det_div < 0.0 || det_beta/det_div < 0.0 || (false || det_gamma/det_div < 0.0) || 1.0 < det_beta/det_div || 1.0 < det_gamma/det_div || 2.0 < det_gamma/det_div + det_beta/det_div)
	{
		//nearest.t = -1.0;
		return;
	}
	else{
		if((nearest.t < 0.0 || nearest.t > (det_t/det_div)) && dot(ray, -normalize(cross(b_ - a_, c_ - a_))) <= 0.0){
			nearest.t = det_t/det_div;
			nearest.normal = -normalize(cross(b_ - a_, c_ - a_));	
			nearest.color = p.color;
			nearest.hit_light = p.light;
			nearest.hit_num += 1;
		}
		return;
	}
}
void exec_intersects(vec3 cur, vec3 ray, inout Intersect i)
{
	Sphere_intersect(cur, ray, Sphere_, i);		
	//Sphere_intersect(cur, ray, Sphere_2, i);
	//Sphere_intersect(cur, ray, Sphere_3, i);
	plane_intersect(cur, ray, i);
	plane_intersect2(cur, ray, plane_light, i);
	plane_intersect2(cur, ray, plane1, i);
	plane_intersect2(cur, ray, plane2, i);
	plane_intersect2(cur, ray, plane3, i);
	plane_intersect2(cur, ray, plane4, i);
	plane_intersect2(cur, ray, plane5, i);
	
}





void triangle_intersect(vec3 cur, vec3 ray, vec3 a_, vec3 b_, vec3 c_, inout Intersect nearest)
{
	float det_div = det(a_ - b_, a_ - c_, ray);
	float det_t = det(a_ - b_, a_ - c_, a_ - cur);
	float det_beta = det(a_ - b_, a_ - cur, ray);
	float det_gamma = det(a_ - cur, a_ - c_, ray);
	nearest.t = -1.0;
	if(det_div == 0.0) return;
	if(det_t/det_div < 0.0 || det_beta/det_div < 0.0 || det_gamma/det_div < 0.0 || 1.0 < det_beta/det_div || 1.0 < det_gamma/det_div || 1.0 < det_gamma/det_div + det_beta/det_div)
	{
		nearest.t = -1.0;
		return;
	}
	else{
		if(nearest.t < 0.0 || nearest.t > det_t/det_div){
			nearest.t = det_t/det_div;
			nearest.normal = cross(b_ - a_, b_ - c_);		
		}
		return;
	}
}

vec2 rand2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

float Rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 random_reflect(vec3 n, vec3 rand){
	vec3 nz = normalize(n);
	vec3 c;
	if(abs(n.x) > 0.9) c = vec3(0,1,0);
	else c = vec3(1,0,0);
	vec3 nx = cross(c,n) / length(cross(c,n));
	vec3 ny = cross(nx, n);
	return rand.x * nx + rand.y * ny + rand.z * nz;
	
}
vec2 pos;
struct TraceBuffer{
	float c;
	vec3 kd;		
};


void main( void )
{   
	pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	//pos.y -=0.5;

    	vec3 col = vec3(0.0);
	
	

    	vec3 cameraPos = vec3(0.0, 0.0, 10.0);
	if(cam_move){
    		cameraPos = rotate(cameraPos, (-mouse.y+0.5)*0.04, vec3(1,0,0));
    		cameraPos = rotate(cameraPos, (-mouse.x+0.5)*0.04, vec3(0,1,0));
	}

	vec3 ray = normalize(vec3(pos, 5.0) - cameraPos);
	vec3 cur = cameraPos;
	float size = 0.5;	
	if(obj == 0)
	{
		Intersect n = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);

		//shade(cur, ray, n);
		float count = 0.0;
		vec3 mul = vec3(1.0);
		vec3 mul_sum = vec3(0.0);
		float pi = 1.0/(4.0*3.14);
		float p =0.3;	
		for(int j=0; j<3; j++){
		for(int i=0; i < 5; i++){			
			exec_intersects(cur, ray, n);
			cur += ray * n.t;
			if(n.hit_light){
				col = vec3(1);
				//mul *= vec3(1);
				break;
			}
			if(n.t < 0.0){	

				mul *= vec3(1.0);
				break;
			}
			if(i==5-1){
				vec3 w = plane_light.a - cur;
				float c = max(dot(w, n.normal), 0.0);
				count += 1.0;
				//col = vec3(1);
				mul *= n.color/pi*c/(1.0/(2.0*p));
				
				break;
			}
			vec2 angles = rand2((float(i)+2.0)*n.t*pos + mouse);
			float rx = Rand(time*mouse + pos * 2.0)*2.0-1.0;;
			float ry = Rand(time*mouse + pos * 3.0)*2.0-1.0;
			float rz = Rand(time*mouse + pos * 4.0);
			vec3 w = random_reflect(n.normal, normalize(vec3(rx, ry, rz)));
			ray = w;
			//float c = max(dot(w, n.normal), 0.0);
			float c = abs(dot(w, n.normal));
			mul *= n.color/pi*c/(1.0/(2.0*p));
			count += 1.0;
			n.t = -1.0;
		}
		count += 1.0;
		mul_sum += mul;
		}
		
		col *= mul_sum/count;
		
		if(false){
		Intersect n = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
		exec_intersects(cur, ray, n);		
		cur += ray * n.t;
		vec3 light_ray = normalize(lightDir(cur));
		Intersect shadow = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
		exec_intersects(cur, light_ray, shadow);
		float angle = atan(light.radius, length(lightDir(cur)));
		int sum_n = 0;
		float intensity = 0.0;
		const int range = 21;
		const int range_half = range/2;
		vec3 light_dir = lightDir(cur);
		float r = length(light_dir);
		float theta = acos(light_dir.y / r);
		float phi = acos(light_dir.x / sqrt(light_dir.x*light_dir.x + light_dir.z * light_dir.z));
		
		
		
		
		
		
		
		if(false){		
			for(int j=0; j<range; j++){
	
				for(int i_=0; i_<range;i_++){
					
					float diff_x = r*sin(theta+(float(j-range_half)*angle/float(range_half)))*cos(phi+(float(i_-range_half)*angle/float(range_half)));							
					float diff_y = r*sin(theta+(float(j-range_half)*angle/float(range_half)))*sin(phi+(float(i_-range_half)*angle/float(range_half)));
					float diff_z = r*cos(theta+(float(j-range_half)*angle/float(range_half)));										
						vec3 diff_light = vec3(diff_x, diff_y, diff_z);
						Intersect ii = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
						exec_intersects(cur, normalize(diff_light), ii);
						if(ii.t >= 0.000001) {	
							intensity += 0.8;	
						}
						sum_n += 1;
				}
			}
		}
		
		
		Intersect m = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
		const int MAX_REF = 2;
		if(n.mirror){
			 for(int j = 1; j < MAX_REF; j++){
			    vec3 ref_direction = reflect(ray, n.normal);
			    exec_intersects(cur, ref_direction, m);
			    n.color = m.color*n.color;
       			}
		}
		Intersect g = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
		if(n.glass){
				float kk_ = 1.0/1.5;
				
			   	vec3 ref_direction = normalize(refract(ray, n.normal, kk_));
				exec_intersects(cur, normalize(ref_direction), g);
				Intersect g2 = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
				if(g.t2 >= 0.0){
					//cur = cameraPos + ray*n.t;
					vec3 cur_ = cur + normalize(ref_direction)*g.t2;
					//kk_ = 1.0/kk_;
					vec3 ref_direction_ = refract(normalize(ref_direction), -g.normal2,1.0/ kk_);					
					exec_intersects(cur_, normalize(ref_direction_), g2);
				}
				
			    n.color = g2.color*n.color;		
				
		}
		}
		//col = n.color;	
		//if(shadow.t >= 0.000001) col -= vec3(intensity/float(sum_n));
		//col = 100.0*angle*vec3(1,1,1);
	

	}
	else if(obj == 1)
	{
		Intersect n = Intersect(-1.0, -1.0,vec3(0.0), vec3(0.0), vec3(1), false, false, vec3(0), false, 0);
		triangle_intersect(cur, ray, vec3(0.0,0.0,2.0) , vec3(0.0,0.2, 0.0), vec3 (0.2,0.0 ,0.0), n);
		n.t;
		float diff = dot(n.normal, lightDir(cur+ray*n.t));
		col = vec3(diff) + vec3(0.1);
	}

	
	{
		vec4 a = texture2D(aa, (gl_FragCoord.xy + 0.5) / resolution.xy);
		if(a.x < 0.07)
			gl_FragColor = vec4(mix(col + a.xyz * 0.4, a.xyz, 0.5), 1.0);
		else
			gl_FragColor = vec4(mix(col + a.xyz * 0.4, a.xyz, 0.9), 1.0);
	}
}
