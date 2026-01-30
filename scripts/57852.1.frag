#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotatey(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatex(in vec3 p, float ang)
{
	return vec3(p.x, p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatez(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z); 
}

float sph(in vec3 p, float r)
{
	return length(p)-r; 
}
float sdbox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float rbox(in vec3 p, in vec3 b, float r)
{
	return length(max(abs(p)-b,0.0))-r; 
}
float plane(in vec3 p, in vec3 n, float d)
{
	return dot(p,n)-d; 
}
float ts1(in vec3 p) 
{
	float d = 1000.0; 
	
	d = min(d, rbox(p, vec3(3.0,0.7,2.0), 0.3)); 
	d = max(d,-rbox(p, vec3(1.80,0.50,2.0), 0.3)); 
	d = max(d, plane(p, vec3(0,0,1), 2.0)); 
	d = max(d, plane(p, vec3(0,0,-1), 2.0)); 
	
	d = max(d, -rbox(p-vec3(0,0.75,0), vec3(0.95,0.35,0.75), 0.15)); 
	//d = min(d, rbox(p-vec3(0.0,0,-0.5), vec3(2.0,0.20,0.25), 0.05)); 
	//d = max(d,-rbox(p-vec3(0.0,0,-0.5), vec3(1.8,0.1,0.3), 0.05)); 
	
	return d; 
}
float ts2(in vec3 p) 
{
	float d = 1000.0; 
	
	d = min(d, rbox(p, vec3(3.0,1.0,2.0), 0.3)); 
	d = max(d,-rbox(p, vec3(1.70,0.40,2.0), 0.3)); 
	d = max(d, plane(p, vec3(0,0,1), 2.0)); 
	d = max(d, plane(p, vec3(0,0,-1), 2.0)); 
	
	//d = min(d, rbox(p-vec3(0.0,0,-0.5), vec3(2.0,0.20,0.25), 0.05)); 
	//d = max(d,-rbox(p-vec3(0.0,0,-0.5), vec3(1.8,0.1,0.3), 0.05)); 
	
	return d; 
}

float scene(in vec3 p) 
{
	float d = 1000.0; 
	//p.z -= 4.0*time; 
	//p.z = mod(p.z+4.0, 8.0)-4.0; 
	//d = min(d, ts1(p-vec3(0.0,0.0,-2.0))); 
	//d = min(d, ts2(p-vec3(0.0,0.0,+2.0))); 
	d = min(d, sdbox(p, vec3(8,2.1,8))); 
	d = max(d, -sdbox(p, vec3(4,2,4))); 
	d = max(d, -sdbox(p-vec3(0,2.0,0), vec3(0.5))); 

	d = min(d, sdbox(p-vec3(2.5,0,0), vec3(2.0,2.0,0.125))); 
	d = min(d, sdbox(p-vec3(-2.5,0,0), vec3(2.0,2.0,0.125))); 

	
	//p.xy = mod(p.xy+0.25,0.5)-0.25; 
	d = min(d, sph(p-vec3(0.0,-1.5,-4.0), 0.5)); 
	return d; 
}

vec3 get_normal(in vec3 p) 
{
	vec3 eps = vec3(0.001,0,0); 
	float nx = scene(p + eps.xyy) - scene(p - eps.xyy); 
	float ny = scene(p + eps.yxy) - scene(p - eps.yxy); 
	float nz = scene(p + eps.yyx) - scene(p - eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 
}

vec3 get_tex(in vec3 p)
{
	#if 0
	p.x = mod(p.x+0.5, 1.0)-0.5;  
	p.z = mod(p.z+0.5, 1.0)-0.5;  
	if (abs(p.x) < 0.01)
		return vec3(0); 
	if (abs(p.z) < 0.01)
		return vec3(0); 
	#endif
	
	return vec3(1); 
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float shadow(in vec3 ro, in vec3 rd)
{
	vec3 pos = ro; 
	float d, dist = 0.0; 
	float shade = 0.0; 
	for (int i = 0; i < 16; i++) {
		d = scene(pos+0.1*(vec3(rand(time+pos.xz+pos.yz*1.0)-0.5))); 
		pos += d*normalize(rd); 
		dist += d; 
		if ( dist < length(rd)) {
			// hit light
			shade += 0.05;
		}
	}
	return 2.0-2.0*clamp(shade,0.0,1.0);
}
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0; 
	vec3 col = vec3(1.0); 
	
	p.x *= resolution.x/resolution.y; 
	
	vec3 ro = vec3(0,0,2.0); 
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 
	
	#if 1
	ro = rotatex(ro,mouse.y*10.0); 
	rd = rotatex(rd,mouse.y*10.0); 
	ro = rotatey(ro,mouse.x*10.0); 
	rd = rotatey(rd,mouse.x*10.0); 
	//ro.z += time; 
	#endif

	vec3 pos = ro; 
	float d, dist = 0.0; 
	for (int i = 0; i < 96; i++) {
		d = scene(pos); 
		pos += d*rd; 
		dist += d; 
	}
	if (abs(d) < 0.1) {
		vec3 n = get_normal(pos); 
		vec3 l = normalize(vec3(1,1,1)); 
		vec3 pl = vec3(0,1,mod(-time,16.0)); 
		
		vec3 pl1 = normalize(pl - pos); 
		vec3 tex = get_tex(pos); 
		float diff = clamp(dot(n,l), 0.0, 1.0); 
		float fres = clamp(dot(n,-rd), 0.0, 1.0); 
		
		vec3 lightpos = vec3(0,0.0,-2.00); 
		vec3 ldir = (lightpos - pos); 
		
		// sample light volume
		float shade = shadow(pos+0.1*n, ldir); 
		
		col = tex*1.0*shade*vec3(1,1,1)*clamp(dot(normalize(ldir),n),0.0,1.0)/pow(length(ldir),0.5); 
		
	}
	
	
	gl_FragColor = vec4(col, 1.0); 
}