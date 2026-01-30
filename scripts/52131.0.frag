#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 sphpos0 = vec3(1.0+sin(time),0.0-abs(sin(time*2.0)),0.0); 

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
	return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang), p.z); 
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

vec2 sph0(in vec3 p) 
{
	return vec2(length(p) - 0.5, 3.0); 
}
vec2 pln0(in vec3 p)
{
	vec3 n = normalize(vec3(-0,1,0)); 
	return vec2(dot(p, n) + 0.5, 1.0); 
}
vec2 box0(in vec3 p, in vec3 b)
{
	
	p = rotatey(p, time*0.6); 
	p = rotatex(p, time*0.1); 
	p = rotatez(p, time*0.2); 
	p.x = sin(p.x*1.0)*0.1; 
	return vec2(udBox(p, b), 2.0); 
}

vec2 min2(in vec2 o1, in vec2 o2)
{
	if (o1.x < o2.x)
		return o1;
	else 
		return o2; 
}
vec2 max2(in vec2 o1, in vec2 o2)
{
	if (o1.x < o2.x)
		return o1;
	else 
		return o2; 
}
vec2 scene(in vec3 p)
{
	vec2 d = box0(p, vec3(0.5,0.5,0.1));
	d = min2(d, box0(p+vec3(0.0,0.5,0.0), vec3(0.5,0.5,0.1))); 
	d = min2(d, sph0(p+sphpos0)); 
	d = min2(d, pln0(p)); 
	return d; 
}
vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.00001, 0.0, 0.0); 
	float nx = scene(p + eps.xyy).x - scene(p - eps.xyy).x; 
	float ny = scene(p + eps.yxy).x - scene(p - eps.yxy).x; 
	float nz = scene(p + eps.yyx).x - scene(p - eps.yyx).x; 
	return normalize(vec3(nx,ny,nz)); 
}

vec3 get_material(in vec3 p, in float obj)
{
	if (obj > 0.5 && obj < 1.5) {
		float u = mod(p.x, 1.0); 
		float v = mod(p.z, 1.0); 
		if ((u > 0.5 && v > 0.5) || (u < 0.5 && v < 0.5) )
			return vec3(1,1,1); 
		else
			return vec3(1,1,1); 
		
	}
	else if (obj > 1.5 && obj < 2.5)
		return vec3(1.0,0.0,0); 
	else if (obj > 2.5 && obj < 3.5)
	{
		p += sphpos0; 
		p = rotatey(p, time*0.3);
		p = rotatex(p, time*0.5);
		p = rotatez(p, time*0.4);
		float u = mod(p.x*8.0, 1.0)+0.125; 
		float v = mod(p.y*7.0, 1.0); 
		if ( v > 0.5 )
			return vec3(1,1,1); 
		else
			return vec3(0,0,0); 
	}
	return vec3(1,1,1); 
}


float ao(in vec3 ro, in vec3 rd)
{
	float shade = 1.0; 
	vec3 pos = ro; 
	for (int i = 0; i < 5; i++) {
		float d = scene(pos).x; 
		pos += rd*d; 
		shade -= d*pow(2.0, 1.0*float(i));
	}
	return shade; 
}
vec3 rm2(in vec3 ro, in vec3 rd, in vec2 p)
{
	vec3 color = vec3(abs(p.y)); 
	vec3 pos = ro; 
	float dist = 0.0; 
	vec2 o; 
	for (int i = 0; i < 32; i++) {
		o = scene(pos);
		pos += rd*o.x;
		dist += o.x; 
	}
	if (o.x < 0.001)
	{	
		vec3 lightpos = vec3(10,10,10); 
		vec3 n = get_normal(pos); 
		vec3 l = normalize(lightpos-pos); 
		vec3 r = reflect(l, n); 
		vec3 material = get_material(pos, o.y); 
		vec3 er = reflect(rd, n); 
		float diff = clamp(dot(n, l), 0.0, 1.0); 
		float spec = pow(clamp(dot(r, rd), 0.0, 1.0), 64.0);
		float amb = ao(pos + 0.01*n, n); 
		color =  -amb*0.05 + diff*material + spec*vec3(1,1,1);   
		//color *= pos.y; 
		float fog = clamp(1.0 - 0.08*dist, 0.0, 1.0);
		color = color*(fog) + vec3(1,1,1)*(1.0-fog); 
	}
	
	return color; 
	
}

void main( void ) {

	vec2 p =  2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 color = vec3(abs(p.y)); 
	
	vec3 ro = vec3(0.0, 0.0, 2.0); 
	vec3 rd = normalize(vec3(-p.x,p.y,-1.0)); 
	
	vec3 pos = ro; 
	float dist = 0.0; 
	vec2 o; 
	for (int i = 0; i < 128; i++) {
	
		o = scene(pos);
		pos += rd*o.x;
		dist += o.x; 
	}
	if (o.x < 0.001)
	{	
		vec3 lightpos = vec3(0,10,10); 
		vec3 n = get_normal(pos); 
		vec3 l = normalize(lightpos-pos); 
		vec3 r = reflect(l, n); 
		vec3 material = get_material(pos, o.y); 
		vec3 re = reflect(rd, n); 
		float diff = clamp(dot(n, l), 0.0, 1.0); 
		float spec = pow(clamp(dot(r, rd), 0.0, 1.0), 64.0);
		float amb = ao(pos + 0.01*n, n); 
		vec3 refl = rm2(pos + 0.01*n, re, p); 
		color =  -amb*0.05 + diff*material + spec*vec3(1,1,1)*0.9 + refl*vec3(1,1,1)*0.4;    
		//color *= pos.y; 
		float fog = clamp(1.0 - 0.08*dist, 0.0, 1.0);
		color = color*(fog) + vec3(abs(p.y))*(1.0-fog); 
	}
	gl_FragColor = vec4(color, 1.0); 
}