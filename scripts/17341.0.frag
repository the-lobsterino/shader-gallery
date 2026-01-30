

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotate_x(in vec3 p, float ang)
{
	float x0 = p.x; 
	float y0 = p.y*cos(ang) - p.z*sin(ang); 
	float z0 = p.y*sin(ang) + p.z*cos(ang); 
	return vec3(x0,y0,z0); 
}
vec3 rotate_y(in vec3 p, float ang)
{
	float x0 = p.x*cos(ang) - p.z*sin(ang); 
	float y0 = p.y; 
	float z0 = p.x*sin(ang) + p.z*cos(ang); 
	return vec3(x0,y0,z0); 
}
vec3 rotate_z(in vec3 p, float ang)
{
	float x0 = p.x*cos(ang) - p.y*sin(ang); 
	float y0 = p.x*sin(ang) + p.y*cos(ang); 
	float z0 = p.z; 
	return vec3(x0,y0,z0); 
}

float cube0(in vec3 p)
{
	p.x *= 0.1; 
	p.x = mod(p.x + 0.5, 1.0) - 0.5; 
	p.y = mod(p.y + 0.5, 1.0) - 0.5; 
	p.z = mod(p.z + 0.5, 1.0) - 0.5; 
	float d = length(max(abs(p) - vec3(00.9), 0.00)) - 0.50; 
	return d; 
}
float sph0(in vec3 p)
{

	p.x *= 0.5; 
	p.z *= 2.0; 
	p.x = mod(p.x + 0.5, 1.0) - 0.5; 
	p.y = mod(p.y + 0.5, 1.0) - 0.5; 
	p.z = mod(p.z + 0.5, 1.0) - 0.5; 
	return length(p)- 0.6+sin(time)*0.0; 
}
float scene(in vec3 p)
{
	
//	return length(p) - 0.5 + sin(p.x*100.0+time*0.5)*0.003 + cos(p.y*50.0+time)*0.01;  
	
	
	
	float d = sin(p.x*1.00) + sin(p.y) + sin(p.z*0.5); 
	d += sin(p.x*10.0*0.0)*0.05; 
	d += cos(p.y*20.0*0.0)*0.05; 
	d += sin(p.z*15.0*0.0)*0.04; 
	d += sin(p.x*0.5*0.0)*0.5; 
	d += cos(p.y*0.6*0.0)*0.5; 
	d += sin(p.z*0.4*0.0)*0.4; 
	float d1 = sph0(p); 
	float d2 = cube0(p);
	return max(d, -d1); 
	//return d2; 
}

vec3 get_normal(in vec3 p) 
{
	vec3 eps = vec3(0.001, 0,0); 
	float nx = scene(p + eps.xyy) - scene(p - eps.xyy); 
	float ny = scene(p + eps.yxy) - scene(p - eps.yxy); 
	float nz = scene(p + eps.yyx) - scene(p - eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 
}
void main( void ) {

	vec2 p = 2.0*(gl_FragCoord.xy / resolution.xy) - 1.0;
	vec3 col = vec3(0.1); 
	
	p.x *= resolution.x/resolution.y; 
	
	vec3 pos = vec3(0,0,1.0); 
	vec3 dir = normalize(vec3(-p.x,-p.y,-1.0)); 


	dir = rotate_y(dir, time*0.1); 
	dir = rotate_x(dir, time*0.15); 
	dir = rotate_z(dir, time*0.18); 
	pos.x -= 5.1; 
	pos.y += 2.0; 
	pos.z += time; 
	float d, dist = 0.0; 
	vec3 v = pos; 
	for (int i = 0; i < 64; i++) {
		
		d = scene(v); 
		v += dir*d*0.75; 
		dist += d; 
	}
	if (abs(d) < 0.1) {
		vec3 n = get_normal(v); 
		
		vec3 l = normalize(vec3(1,-1,1)); 
		float diff = clamp(dot(n, l), 0.0, 1.0);
		float fres = 1.0 - clamp(dot(n, -dir),0.0, 1.0); 
		col = diff*vec3(1.0,1.0,1.0)*0.8 + fres*vec3(0,0,1)*0.5; 
		col -= dist*0.01; 
		col = clamp(col, 0.0, 1.0); 
		
	}
	
	gl_FragColor = vec4(col, 1.0); 
}