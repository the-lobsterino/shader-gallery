
// line light test 
// fixed diffuse, and my falloff was inverse square root instead of inverse square, oops.

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//float t=2.6;
float t=time;

vec3 lightpos1 = vec3(sin(t)-1.*cos(t),15.+15.5*cos(t),sin(t)); 
vec3 lightpos2 = vec3(sin(t)+1.*cos(t),-.5+.22*-cos(t),-sin(t));


//vec3 lightpos1 = vec3(-2.8,10.+10.8*sin(time+0.),0.); 
//vec3 lightpos2 = vec3(2.5,10.+10.8*sin(time),0.);

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rotatey(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.z*sin(ang), p.y, p.x*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatex(in vec3 p, float ang)
{
	return vec3(p.x, p.y*cos(ang)-p.z*sin(ang), p.y*sin(ang)+p.z*cos(ang)); 
}
vec3 rotatez(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.y*sin(ang), p.x*sin(ang)+p.y*cos(ang), p.z); 
}

vec2 plane(in vec3 p, in vec3 n, float d, float obj)
{
	n = normalize(n); 
	return vec2(dot(p,n) + d, obj); 
}

vec2 rbox(in vec3 p, in vec3 pos, in vec3 ang, float obj)
{
	vec3 b = vec3(0.3,0.3,0.3); 
	p -= pos; 
	p = rotatey(p, ang.y*time); 
	p = rotatex(p, ang.x*time); 
	p = rotatez(p, ang.z*time); 
	return vec2(length(max(abs(p)-b,0.0)) - 0.1, obj); 
}

vec2 sdCapsule( vec3 p, vec3 a, vec3 b, float r, float obj )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return vec2(length( pa - ba*h ) - r, obj);
}
vec2 sph(in vec3 p, float r, float obj)
{
	return vec2(length(p) - r, obj); 
}

vec2 min2(vec2 o1, vec2 o2)
{
	if (o1.x < o2.x)
		return o1; 
	else 
		return o2; 
}
vec2 scene(in vec3 p)
{
	vec2    d = plane(p, vec3(0,1.0,0), 0.9, 0.0); 
	d = min2(d, plane(p, vec3(0,0.0,1.0), 1.3, 0.0));
	d = min2(d, sdCapsule(p, lightpos1,lightpos2,0.1,6.));
	d = min2(d, sph(p-vec3(1.),1.,0.0));
	

	d = min2(d, sph(p-vec3(-2.,1.,-1.),1.,0.0));
	return d; 
}

vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.0001, 0, 0); 
	float nx = scene(p + eps.xyy).x - scene(p - eps.xyy).x; 
	float ny = scene(p + eps.yxy).x - scene(p - eps.yxy).x; 
	float nz = scene(p + eps.yyx).x - scene(p - eps.yyx).x; 
	return normalize(vec3(nx,ny,nz)); 
}

float softshadow(in vec3 ro, in vec3 rd)
{
	vec3 pos = ro; 
	float shade = 0.0; 
	for (int i = 0; i < 8; i++) {
		vec2 d = scene(pos); 
		pos += rd*d.x; 
		shade += (1.0 - shade)*clamp(d.x, 0.0, 0.90); 
	}
	return shade; 
}

float ao(in vec3 ro, in vec3 rd)
{
	vec3 pos = ro; 
	float shade = 1.0; 
	for (int i = 0; i < 5; i++) {
		vec2 d = scene(pos); 
		pos += rd*d.x; 
		shade -= d.x*pow(2.0, 0.5*float(i)); 
	}
	return shade; 
}

vec3 linelight(  vec3 rd, vec3 pos, vec3 lp1, vec3 lp2 )
{
	//plane-line intersection test, the line is the light 
	//and the ray exists on the plane, seems to work ok..
	lp2-=lp1;
	vec3 lv = normalize(lp2);
	vec3 rp = cross(cross(lv,rd),rd);
	return lp1+lv*clamp(dot(pos-lp1,rp)/dot(lv,rp), 0.,length(lp2));
}

vec3 linelightd( vec3 pos, vec3 lp1, vec3 lp2 )
{
	lp2-=lp1;
	vec3 lv = normalize(lp2);
	return lp1+lv*clamp(dot(pos-lp1,lv),0.,length(lp2));
}

void main( void ) {

	vec2 p = 2.0* ( gl_FragCoord.xy / resolution.xy ) - 1.0;

	p.x *= resolution.x/resolution.y; 
	
	vec3 color = vec3(0.0); 
	vec3 contrib = vec3(0.0); 
	vec3 ro = vec3(0.0,0,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 
	

	vec3 pos = ro; 
	float dist = 0.0; 
	vec2 d; 
	//pos+=rd*2.;
	for (int i = 0; i < 64; i++) {
	
		d = scene(pos); 
		pos += rd*d.x*1.0;
		dist += d.x*1.0; 
		
	}
	if (dist < 100.0 && d.x < 0.001) {
		vec3 n = get_normal(pos); 
		
		vec3 rp = cross(n,rd);
		
		vec3 ref = reflect(rd,n);
		
		//spec
		vec3 lineLight = linelight(ref,pos,lightpos1,lightpos2);		
		vec3 ls = lineLight-pos;
		float bris = 1./pow(length(ls),2.);
		//bris*=lineLight.a;
		ls = normalize(ls);
		
		//diffuse
		lineLight = linelightd(pos,lightpos1,lightpos2);
		vec3 ld = lineLight-pos;
		float brid= 1./pow(length(ld),2.);
		ld = normalize(ld);
			
		vec3 r = reflect(rd, n); 
		float diff = clamp(dot(n, ld), 0.0, 1.0); 
		float spec = pow(clamp(dot(r, ls), 0.0, 1.0), 109.0); 
		float shadow = 0.;//clamp(softshadow(pos+0.01*n, l), -1.0, 1.0); 
		if (d.y > 0.5 && d.y < 1.5)   color += diff*vec3(1,1,1)*brid;  
		else if(d.y > 5.5)
			color = vec3(1,1,1);
		else
			color += diff*vec3(0.5,1,1)*brid*.1 + spec*vec3(0.5,1,1)*bris;  
	}
	
	gl_FragColor = vec4(pow(color,vec3(1./2.2)), 1.0); 
}