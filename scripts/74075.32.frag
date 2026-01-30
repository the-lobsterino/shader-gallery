#ifdef GL_ES
precision mediump float;
#endif
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

int obj = 0;

//vec3 lightDir(vec3 pos) = normalize(vec3(1.0, 1.0, 1.0));


struct Sphere
{
	vec3 center;
	float radius;
	vec3 color;
	bool mirror;
	bool glass;
};
float light_intensity = 30000.0;
Sphere Sphere_ = Sphere(vec3(0.0,0.0,0.0), 0.4, vec3(1,0.5,0.5), true, false);
Sphere Sphere_2 = Sphere(vec3(3, 0.7, 3), 0.3, vec3(0.5, 0.5, 1), false, false);
Sphere Sphere_3 = Sphere(vec3(0.4, -0.0, 1.7), 0.7, vec3(0.5, 1, 1), false, true);
//Sphere light = Sphere(20.0*vec3(-1.0, 1.0, 1.0), 50.0, vec3(0.5, 0.5, 1), false);
Sphere light = Sphere(20.0*vec3(1.0,1.0,1.0), 5.0, vec3(0.5, 0.5, 1), false, false);

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
		float t2 = b/(2.0*a) + sqrt(tmp);
		if(t >= 0.0001){
			if(nearest.t > t || nearest.t < 0.0) {
				nearest.t = t;
				nearest.normal = normalize(cur+ray*t - Sphere.center);
				//float  diff = dot(nearest.normal, lightDir(cur+ray*t));
				float diff = light_intensity*dot(nearest.normal, normalize(lightDir(cur+ray*t)))/(4.0*3.14*length(lightDir(cur+ray*t))*length(lightDir(cur+ray*t)));
				nearest.color = diff * Sphere.color + vec3(0.1);
				nearest.mirror = Sphere.mirror;
				nearest.glass = Sphere.glass;
			}			
		}
		else{
			if(nearest.t2 > t2 || nearest.t2 < 0.0) {
				nearest.t2 = t2;
				nearest.normal = normalize(cur+ray*t2 - Sphere.center);
				//nearest.glass = Sphere.glass;
			}
			
		}
	}
}
void plane_intersect(vec3 cur, vec3 ray, inout Intersect n)
{
	float plane_y = -1.0;
	float t = -1.0;
	if(ray.y != 0.0) t = (plane_y - cur.y)/ray.y;
	
	if(0.001 <= t && t < 1000.0) {
		if(n.t > t || n.t < 0.0) {
			n.t = t;
			n.normal = normalize(vec3(0,1,0));			
			vec3 pos = cur + ray * t;
			//float  diff = dot(n.normal, lightDir(pos));
			float diff = light_intensity*dot(n.normal, normalize(lightDir(pos)))/(4.0*3.14*length(lightDir(pos))*length(lightDir(pos)));
			vec3 col = vec3(0.7,0.7,0.7);
			//vec3 col = vec3(0.2);
			if(mod(pos.x, 2.0) < 1.0 && mod(pos.z, 2.0) < 1.0 || mod(pos.x, 2.0) > 1.0 && mod(pos.z, 2.0) > 1.0) col = vec3(0.2);
			n.color = diff * col + vec3(0.1);
		}
		return;
	}	
	
}
void exec_intersects(vec3 cur, vec3 ray, inout Intersect i)
{
	Sphere_intersect(cur, ray, Sphere_, i);		
	Sphere_intersect(cur, ray, Sphere_2, i);
	Sphere_intersect(cur, ray, Sphere_3, i);
	plane_intersect(cur, ray, i);
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
		nearest.t = det_t/det_div;
		nearest.normal = cross(b_ - a_, b_ - c_);
		return;
	}
}


void main( void )
{   
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	pos.y -=0.5;

    	vec3 col = vec3(0.0);

    	vec3 cameraPos = vec3(0.0, -0.0, 20.0);
	if(cam_move){
    		cameraPos = rotate(cameraPos, (-mouse.y+0.5)*0.04, vec3(1,0,0));
    		cameraPos = rotate(cameraPos, (-mouse.x+0.5)*0.04, vec3(0,1,0));
	}

	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 cur = cameraPos;
	float size = 0.5;	
	if(obj == 0)
	{
		Intersect n = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
		exec_intersects(cur, ray, n);		
		cur += ray * n.t;
		vec3 light_ray = normalize(lightDir(cur));
		Intersect shadow = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
		exec_intersects(cur, light_ray, shadow);
		float angle = atan(light.radius, length(lightDir(cur)));
		int sum_n = 0;
		float intensity = 0.0;
		//int range = int((angle/2.0) / (3.14/40.0));
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
				//if(!(j == range_half || i_ == range_half)){										
					vec3 diff_light = vec3(diff_x, diff_y, diff_z);
					Intersect ii = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
					exec_intersects(cur, normalize(diff_light), ii);
					if(ii.t >= 0.000001) {	
						intensity += 0.8;	
						//shadow.t = -1.0;
					}
					sum_n += 1;
				//}
			}
		}
	}
		
		
		Intersect m = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
		const int MAX_REF = 2;
		if(n.mirror){
			 for(int j = 1; j < MAX_REF; j++){
			    vec3 ref_direction = reflect(ray, n.normal);
			    exec_intersects(cur, ref_direction, m);
			    n.color = m.color*n.color;
       			}
		}
		Intersect g = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
		if(n.glass){
				float kk_ = 1.0/1.5;
			   	vec3 ref_direction = refract(ray, n.normal, kk_);
				exec_intersects(cur, normalize(ref_direction), g);
				Intersect g2 = Intersect(-1.0,-1.0, vec3(0.0), vec3(0.0), vec3(1), false, false);
				if(g.t2 >= 0.0){
					vec3 cur_ = cur + normalize(ref_direction)*g.t2;
					kk_ = 1.0/kk_;
					ref_direction = refract(normalize(ref_direction), -g.normal, kk_);
					
					exec_intersects(cur_, normalize(ref_direction), g2);
					//n.color=vec3(0);
				}
				
			    n.color = g2.color*n.color;
				//n.color = ref_direction;			
		}
		col = n.color;	
		//col = (i.t)*vec3(1)*100.0;
		//col = vec3(i.t+0.5);
		if(shadow.t >= 0.000001) col -= vec3(intensity/float(sum_n));
		//col = 100.0*angle*vec3(1,1,1);

	}
	else if(obj == 1)
	{
		Intersect n = Intersect(-1.0, -1.0,vec3(0.0), vec3(0.0), vec3(1), false, false);
		triangle_intersect(cur, ray, vec3(0.0,0.0,2.0) , vec3(0.0,0.2, 0.0), vec3 (0.2,0.0 ,0.0), n);
		n.t;
		float diff = dot(n.normal, lightDir(cur+ray*n.t));
		col = vec3(diff) + vec3(0.1);
	}

    gl_FragColor = vec4(col, 1.0);
}