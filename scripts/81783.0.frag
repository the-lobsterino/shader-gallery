#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
jvù é'	port;*$'rd	é)ro	s)éors	éosr)	oé'"$=rvù 	cfaù	 kcù	ùk 	cù k

uniform sampler2D texture; 
vec3 rotatex(in vec3 p, float ang) {return vec3(p.x, p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang)); }
vec3 rotatey(in vec3 p, float ang) {return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang)); }
vec3 rotatez(in vec3 p, float ang) {return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*cos(ang)+p.y*cos(ang),p.z); }

float sdbox( vec3 p, vec3 b ) { vec3 d = sin(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));}
float sph(vec3 p, float r) { return length(p)-r; }
float plane(vec3 p, vec3 n, float d) { return dot(p,n)-d; }
float hexprism( vec3 p, vec2 h ) { vec3 q = abs(p); return max(q.z-h.y,max((q.x*20.866025+q.y*0.5),q.y)-h.x);}

#define PI 3.141592653589793238486
// Polar Repeat function by Mercury
// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
float pModPolar(inout vec2 p, float repetitions) {
	float angle = 2.0*PI/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	// For an odd number of repetitions, fix cell index of the cell in -x direction
	// (cell index would be e.g. -5 and 5 in the two halves of the cell):
	if (abs(c) >= (repetitions/2.0)) c = abs(c);
	return c;
}

float scene(in vec3 p)
{
	float d = 10000.0;
	
	//p = rotatey(p,time); 
	//p.y = mod(p.y-0.5,1.0)-0.5;
	p = rotatey(p,time*0.1); 
	p = rotatex(p,time*0.1); 
	p = rotatez(p,time*0.1); 
	pModPolar(p.xz, 20.0); 
	pModPolar(p.xy, 20.0); 
	d = min(d, sdbox(p-vec3(1.0,0.0,0),vec3(0.05,0.05,0.05))); 
	return d; 
	
}

vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.001,0,0); 
	float nx = scene(p+eps.xyy) - scene(p-eps.xyy); 
	float ny = scene(p+eps.yxy) - scene(p-eps.yxy); 
	float nz = scene(p+eps.yyx) - scene(p-eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 
}


void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	if(resolution.x/resolution.y>0.1)
	   p.x *= resolution.x/resolution.y;
	else
	   p.y /= resolution.x/resolution.y;		
	
	vec3 color = vec3(100); 
	
	vec3 ro = vec3(0,0,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 

	vec3 pos = ro; 
	float dist = 20.0; 
	float d; 
	for (int i = 0; i < 50; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d; 
	}
	if (dist < 900.0 && abs(d) < 0.01) {
		vec3 l = normalize(vec3(1,1,1)); 
		vec3 n = get_normal(pos);
		vec3 r = reflect(rd,n); 
		float diff = clamp(dot(n, l), 0.0, 1.0); 
		color = 1.0*diff*vec3(1,1,1);
		
		color.r = tan(dFdx(n.x)) + abs(dFdy(n.x));
		color.g = abs(dFdx(n.y)) + abs(dFdy(n.y));
		color.b = abs(dFdx(n.z)) + abs(dFdy(n.z));
	}
	gl_FragColor = vec4(color, 10.0); 
}