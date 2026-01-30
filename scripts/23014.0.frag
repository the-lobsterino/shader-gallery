// Mr VB

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
	return vec3(p.x,p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatez(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z); 
}

vec3 getTexture(in vec3 p)
{
	p = rotatey(p, time*0.8); 
	p = rotatex(p, time*0.7); 
	p = rotatez(p, time*0.6); 
	float c1 = mod(p.x*1.0, 1.0);
	float c2 = mod(p.y*1.0, 1.0);
	float c3 = mod(p.z*1.0, 1.0);
	if ((c1 > 0.5 && c2 > 0.5) || (c1 < 0.5 && c2 < 0.5))
		return vec3(1,1,1);
	else
		return vec3(0,0,0); 
}
float scene(in vec3 p)	
{
	p = rotatey(p, time*0.8); 
	p = rotatex(p, time*0.7); 
	p = rotatez(p, time*0.6); 
	p.z += 1.0*sin(clamp(pow(length(p.xy),1.0),0.0,1.0)*p.z*100.0+time)*0.02*clamp(sin(time),0.0,1.0);
	//p.y += -abs(sin(time))*1.0; 
	//p.x = mod(p.x+1.0, 2.0) - 1.0; 
	//p.y = mod(p.y+1.0, 2.0) - 1.0; 
	return length(p) - 1.0; 
}
vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.001, 0, 0); 
	float nx = scene(p + eps.xyy) - scene(p - eps.xyy); 
	float ny = scene(p + eps.yxy) - scene(p - eps.yxy); 
	float nz = scene(p + eps.yyx) - scene(p - eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 
}


void main( void ) {

	//
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 

	
	vec3 campos = vec3(sin(time)*10.0,1,0); 
	vec3 camtar = vec3(0,1,1); 
	vec3 camup = vec3(0,1,0);
	
	vec3 camdir = normalize(camtar-campos);
	vec3 cu = normalize(cross(camdir, camup)); 
	vec3 cv = normalize(cross(cu, camdir)); 
	
	vec3 color = 0.2*vec3(1,1,1)*clamp(1.0-0.5*length(p),0.0,1.0); 
	
	vec3 ro = vec3(0,0,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 

	vec3 pos = ro; 
	float dist = 0.0; 
	float d; 
	for (int i = 0; i < 64; i++) {
		d = scene(pos); 
		pos += rd*d;
		dist += d; 
	}
	if (dist < 10.0 && abs(d) < 0.01) {
		vec3 n = get_normal(pos); 
		vec3 l = normalize(vec3(1,1,1)); 
		vec3 r = reflect(rd, n); 
		float shade = 1.0; 
		float fres = clamp(dot(n,-rd),0.0, 1.0); 
		float spec = pow(clamp(dot(r,normalize(vec3(0,1,0))), 0.0, 1.0), 5.0); 
		float spec1 = pow(clamp(dot(r,normalize(vec3(-1,0,0))), 0.0, 1.0), 4.0)*fres; 
		float spec2 = pow(clamp(dot(r,normalize(vec3(1,0,-1.0))), 0.0, 1.0), 23.0); 
		float spec3 = pow(clamp(dot(r,normalize(vec3(5,0,0.5))), 0.0, 1.0), 2.0)*fres; 
		vec3 tex = getTexture(n); 
		//float diff = clamp(dot(n,l), 0.0, 1.0); 
		color = tex*0.2*mix(vec3(1,1,1)*0.8,vec3(1,1,1)*0.5,fres); 
		color += 0.05*vec3(1,1,1)*clamp(-n.y,0.0,1.0); 
		color += vec3(1,1,1)*spec; 
		color += 0.2*vec3(1,1,1)*spec1; 
		//color += 0.1*vec3(1,1,1)*pow(spec1,16.0); 
		color += 0.2*vec3(1,1,1)*spec2; 
		color += 0.1*vec3(1,1,1)*spec3; 
		//color += 0.1*vec3(1,1,1)*pow(spec3,1.0); 
		color *= shade; 
	}
		
			      
	
	gl_FragColor = vec4(color, 1.0); 
}