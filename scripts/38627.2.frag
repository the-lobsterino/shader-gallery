#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D tex;


vec2 sph0(vec3 p, float time)
{
	
	return vec2( length(p-vec3(sin(time))), 1.0); 
}
float scene(vec3 p, float time)
{
	return sph0(p, time).x; 
}

vec3 get_normal(vec3 p,float time)
{
	vec3 eps = vec3(0.001,0,0); 
	float nx = scene(p + eps.xyy,time) - scene(p - eps.xyy,time); 
	float ny = scene(p + eps.yxy,time) - scene(p - eps.yxy,time); 
	float nz = scene(p + eps.yyx,time) - scene(p - eps.yyx,time); 
	return normalize(vec3(nx,ny,nz)); 
}


vec3 rm(out vec3 pos, out float obj_id, in vec3 ro, in vec3 rd,float time)
{
	vec3 color = vec3(0); 
	obj_id = -1.0;
	pos = ro; 
	float dist = 0.0; 
	for (int i = 0; i < 64; i++) {
		float d = scene(pos, time);
		pos += rd*d;
		dist += d;	
	}
	if (dist < 100.0) {
		vec3 lightpos = vec3(100.0,0.0,0.0); 
		vec3 n = get_normal(pos, time);
		//vec3 l = normalize(vec3(1,0,0.0)); 
		vec3 l = normalize(lightpos-pos); 
		vec3 r = reflect(n, l); 
		float diff = 0.4*clamp(dot(n, normalize(vec3(1,-5,4))), 0.0, 1.0); 
		float amb = 0.1; 
		float spec0 = 0.3*pow(clamp(dot(r, normalize(vec3(-1.0,0,1.0))),0.0,1.0), 100.0); 
		float spec1 = 0.5*pow(clamp(dot(r, normalize(vec3(1.0,0,2.0))),0.0,1.0), 100.0); 
		float spec2 = 3.0*pow(clamp(dot(r, normalize(vec3(0.0,0.5,1.0))),0.0,1.0), 10.0); 
		color = diff*vec3(1.0)/dist + amb*vec3(1.0,1.0,1.0)*clamp(pos.y,0.0,1.0)*1.0 + spec0*vec3(1,1,1) + smoothstep(0.0,1.0,spec1)*vec3(1,1,1) + 1.0*pow(spec1,2.0)*vec3(1,1,1);
		color += smoothstep(0.0,0.5,spec2)*vec3(1,1,1)*pos.y*2.0; 
		obj_id = 1.0;
	}
	return color; 
}

float intersect_sphere(in vec3 ro, in vec3 rd, in float time, in float num)
{
	float r = 0.5; 
	if (num > 0.5) {
		ro.y += cos(time*0.1 + num*0.125); 
		ro.x -= sin(time*0.25 + num*0.5); 
		ro.z -= sin(time*0.125 + num*0.25); 
		r = 0.1; 
	}

	float a = dot(rd, rd); 
	float b = 2.0*dot(ro, rd); 
	float c = dot(ro, ro) - r*r;
	float disc = b*b - 4.0*a*c;
	if (disc < 0.0) {
		return -1.0; 
	}  
	float dist = sqrt(disc); 
	float q; 
	if (b < 0.0) 
		q = (-b - dist)/2.0; 
	else
		q = (-b + dist)/2.0; 
	float t0 = q/a; 
	float t1 = c/q; 
	float t = min(t0,t1); 
	return t ;
}
vec3 get_sphere_normal(vec3 p,float time, float num)
{
	if (num > 0.5) {
		p.y += cos(time*0.1 + num*0.125); 
		p.x -= sin(time*0.25 + num*0.5); 
		p.z -= sin(time*0.125 + num*0.25); 
	}
	return normalize(p);
}
vec3 raytrace(out vec3 pos, out vec3 normal, out float obj_id, in vec3 ro, in vec3 rd, float time)
{
	vec3 color = vec3(0); 
	float dist = 100000.0; 
	float num = 0.0; 
	for (int i = 0; i < 10; i++) {
		float a = float(i); 
		float t = intersect_sphere(ro,rd, time, a);
		if (t > 0.0 && t < dist) {
			dist = t;
			num = a;  
		}
	}
	pos = ro + dist*rd;
	if (dist < 100000.0) {
		vec3 lightpos = vec3(100.0,0.0,0.0); 
		vec3 n = get_sphere_normal(pos, time, num);
		//vec3 l = normalize(vec3(1,0,0.0)); 
		vec3 l = normalize(lightpos-pos); 
		vec3 r = reflect(n, l); 
		float diff = 0.4*clamp(dot(n, normalize(vec3(1,-5,4))), 0.0, 1.0); 
		float amb = 0.1; 
		float spec0 = 0.3*pow(clamp(dot(r, normalize(vec3(-1.0,0,1.0))),0.0,1.0), 100.0); 
		float spec1 = 0.5*pow(clamp(dot(r, normalize(vec3(1.0,0,2.0))),0.0,1.0), 100.0); 
		float spec2 = 3.0*pow(clamp(dot(r, normalize(vec3(0.0,0.5,1.0))),0.0,1.0), 10.0); 
		color = diff*vec3(1.0)/dist + amb*vec3(1.0,1.0,1.0)*clamp(pos.y,0.0,1.0)*1.0 + spec0*vec3(1,1,1) + smoothstep(0.0,1.0,spec1)*vec3(1,1,1) + 1.0*pow(spec1,2.0)*vec3(1,1,1);
		color += smoothstep(0.0,0.5,spec2)*vec3(1,1,1)*pos.y*2.0; 
		obj_id = 1.0;
		normal = n; 
	}
	else {
		obj_id = -1.0;
		color = vec3(0); 
		normal = vec3(1); 
	}

	return color; 
}


#define PI 3.14159265358979
void main()
{
	vec2 p = 2.0 * (gl_FragCoord.xy / resolution) - 1.0; 
	p.x *= resolution.x/resolution.y; 
	vec3 color = vec3(0); 


	
	vec3 ro = vec3(0,0,2.0); 
	vec3 rd = normalize(vec3(p.x,p.y,-1.5));  

	vec3 pos; 
	float obj_id;
	float tot_obj_id = 0.0; 
	vec3 tot_color = vec3(0); 
	for (int i = 0; i < 5; i++) {
		float a = float(i)/5.0; 
		vec3 n; 
		//color = rm(pos,obj_id, ro+vec3(cos(2.0*PI*a),sin(2.0*PI*a),0)*0.001, rd, time*40.0+a*0.02);
		color = raytrace(pos,n,obj_id, ro, rd, time*5.0+a*0.2);
		if (obj_id > 0.0) {
			vec3 rpos; 
			vec3 rn; 	
			float robj_id; 
			color += 1.0*clamp(raytrace(rpos,rn,robj_id, pos+n*0.001, reflect(rd,n), time*5.0+a*0.2), 0.0, 1.0);
		}
		tot_obj_id += obj_id; 
		if (obj_id < 0.0) {
			color = vec3(1.0-length(p*0.5))*0.4; 
		}
		//color = color*obj_id + (1.0 - obj_id)*vec3(1.0-length(p*0.5))*0.4; 
		tot_color += color; 
	}
	color = tot_color / 5.0; 
	gl_FragColor = vec4(color, 1.0); 
}
