//twistythings / jvb

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightpos = vec3(0,10,10.0+sin(time)*0.0); 

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

float box(in vec3 p, in vec3 b)
{
	float ofs = 0.5; 
	float ox = float(int(p.x/1.0+0.5)); 
	float oy = float(int(p.y/1.0+0.5)); 
	p.x = mod(p.x+0.5,2.0*ofs) - ofs; 
	p.y = mod(p.y+0.5,2.0*ofs) - ofs; 
	//p.z = mod(p.z+ofs,2.0*ofs) - ofs; 
	p = rotatez(p, p.z*2.18+sin(ox*2.0+oy*3.0+time*1.8)); 
	return length(max(abs(p)-b, 0.0)) - 0.002; 
}
float pln(in vec3 p, float d)
{
	vec3 n = normalize(vec3(0,1,0)); 
	return dot(p, n) - d;
}
float sph(in vec3 p, float r)
{
	p.x = mod(p.x+0.5,1.0) - 0.5; 
	return length(p) - r; 
}
float scene(in vec3 p)
{
	float d0 = sph(p, 0.5); 
	float d1 = pln(p, -0.5); 	
	float d2 = box(p, vec3(0.2,0.001,10.0+10.0)); 
	return d2; 
}
vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.01,0,0);
	float nx = scene(p+eps.xyy) - scene(p-eps.xyy); 
	float ny = scene(p+eps.yxy) - scene(p-eps.yxy); 
	float nz = scene(p+eps.yyx) - scene(p-eps.yyx); 
	return normalize(vec3(nx,ny,nz));
}

float ao(in vec3 ro, in vec3 rd)
{
	vec3 pos = ro; 
	float dist = 0.0; 
	float d;
	for (int i = 0; i < 5; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d*pow(2.0, 0.5*float(i)); 
	}
	return clamp(dist*0.01, 0.0, 1.0); 
}

void main( void ) {

	vec2 p = 2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0;
	p.x *= resolution.x/resolution.y; 
	
	vec3 color = vec3(0.1); 
	vec3 contrib = vec3(0.0); 
	vec3 ro = vec3(0.5,0,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 

	//rd = rotatey(rd, time*0.6); 
	//rd = rotatex(rd, time*0.5); 
	//rd = rotatez(rd, time*0.3); 

	vec3 pos = ro; 
	float dist = 0.0; 
	float d;
	for (int i = 0; i < 32; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d; 
		
		if (dist < 100.0 && abs(d) < 0.1) 
		{			
		vec3 n = get_normal(pos); 
		vec3 l = normalize(lightpos - pos); 
		float diff = clamp(dot(n, l), 0.0, 1.0); 
		float shade = ao(pos + n*0.001, n*10.0); 
		contrib +=clamp( shade*vec3(1,1,1)*0.5+1.0*diff*vec3(1,1,1)*1.0, 0.0, 1.0);
		}
	}
	contrib /= 32.0; 
	color += contrib; 
	
	color *= clamp(1.0 - 0.15*dist, 0.0, 1.0); 	
	gl_FragColor = vec4(color, 1.0); 
}