// pModPolar.glsl

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D texture; 
vec3 rotatex(in vec3 p, float ang) {return vec3(p.x, p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang)); }
vec3 rotatey(in vec3 p, float ang) {return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang)); }
vec3 rotatez(in vec3 p, float ang) {return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z); }

float sdbox( vec3 p, vec3 b ) { vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));}
float sph(vec3 p, float r) { return length(p)-r; }
float plane(vec3 p, vec3 n, float d) { return dot(p,n)-d; }
float hexprism( vec3 p, vec2 h ) { vec3 q = abs(p); return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);}

#define boxSize vec3(0.025,0.05,0.05) 

#define PI 3.141592653589793238486
// Polar Repeat function by Mercury
// Repeat around the origin by a fixed angle.
// For easier use, num of repetitions is use to specify the angle.
void pModPolar(inout vec2 p, float repetitions) 
{
	float angle = PI / repetitions;
	float a2 = 2.0 * angle;
	float a = atan(p.y, p.x) + angle;
	float r = length(p);
	float c = floor(a / a2);
	a = mod(a,a2) - angle;
	p = r * vec2(cos(a), sin(a));
}

float scene(in vec3 p)
{
	float d = 1000.0;
	
	//p = rotatey(p,time); 
	//p.y = mod(p.y-0.5,1.0)-0.5;
	p = rotatey(p,time*0.1); 
	p = rotatex(p,time*0.12); 
	p = rotatez(p,time*0.123);
	d = min(d, hexprism(p,boxSize.xy)); 
	for(float i = 0.; i <= 1.; i += 1./3.){
		p -= vec3(sign(p.x),sign(p.y),sign(p.z))*0.75;
		p *= vec3(1.25);
		d = min(d, hexprism(p,boxSize.xy));
	}
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


void main( void )
{
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	p.x *= resolution.x/resolution.y;
	
	vec3 color = vec3(0.3); 
	
	vec3 ro = vec3(0,0,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-1.0)); 

	vec3 pos = ro; 
	float dist = 0.0; 
	float d; 
	for (int i = 0; i < 64; i++) 
	{
		d = scene(pos); 
		pos += rd*d; 
		dist += d; 
	}
	if (dist < 10.0 && abs(d) < 0.01) 
	{
		vec3 l = normalize(vec3(1,1,1)); 
		vec3 n = get_normal(pos);
		vec3 r = reflect(rd,n); 
		float diff = clamp(dot(n, l), 0.0, 1.0); 
		color = diff*vec3(0.9,0.9,0.2); 
	}
	gl_FragColor = vec4(color.brg, 1.0); 
}