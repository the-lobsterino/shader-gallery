#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265
#define MAX_DIST 1000.
#define MIN_DIST .0001
#define MAX_STEP 128

struct Ray {
	vec3 o;
	vec3 p;
	vec3 dir;
	vec3 c;
	float dist;
};

struct Sphere {
	vec4 p;
	vec3 color;
};
	
struct Cube {
	vec3 p;
	vec3 c;
	vec3 s;
};

struct Light {
	vec3 p;
	vec3 c;
} light;
	
float dist(vec3 p){
	float d = 0.;
	d = length(p-vec3(.6,0,0))-.5;
	
	vec3 cu = abs(p-vec3(-.6,0,0))-.5;
	d = min(length(max(cu,0.)) + min(0.,max(cu.x,max(cu.y,cu.z))),d);
	
	d = min(length(p-vec3(sin(2./3.*PI*2.)*1.5,1,cos(2./3.*PI*2.)*1.5))-.1,d);
	d = min(length(p-vec3(sin(1./3.*PI*2.)*1.5,1,cos(1./3.*PI*2.)*1.5))-.1,d);
	d = min(length(p-vec3(sin(0.)*1.5,1,cos(0.)*1.5))-.1,d);
	
	return d;
}

void march(inout Ray r){
	for(int i = 0;i<MAX_STEP;i++){
		r.p = r.o + r.dist*r.dir;
		float d = dist(r.p);
		if(d <= MIN_DIST || d > MAX_DIST)break;
		r.dist += d;
	}
}

vec3 sNormal(vec3 p){
	vec2 t = vec2(.001,0);
	float d = dist(p);
	
	return normalize(d - vec3(
		dist(p-t.xyy),
		dist(p-t.yxy),
		dist(p-t.yyx)
	));
}

float diffuse(vec3 p,vec3 L){
	return max(dot(sNormal(p),normalize(L)),0.);
}

vec3 colorDiff(Light l,Ray r){
	vec3 c = vec3(0);
	vec3 N = sNormal(r.p);
	vec3 L = normalize(l.p-r.p);
	float d = diffuse(r.p,L);
	
	c += l.c * d;
	
	return c;
}

float bPhong(Light l,Ray r){
	float c = 0.;
	vec3 N = sNormal(r.p);
	vec3 L = normalize(l.p-r.p);
	float d = diffuse(r.p,L);
	
	c += pow(max(dot(normalize(L-r.dir),N),0.),100.)*2. * d;
	
	return c;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	uv.x*= resolution.x/resolution.y;
	uv*=1.5;
	vec2 m = mouse *2.-1.;
	m.x*= resolution.x/resolution.y;
	m*=1.5;
	
	float camz = PI;
	vec3 ca = vec3(
		PI/2.+m.y*PI/2.,
		PI/2.+m.x*PI/1.,
		0
	);
	
	mat3 rotX = mat3(
		1,         0,        0,
		0, sin(ca.x),cos(ca.x),
		0,-cos(ca.x),sin(ca.x)
	);
	
	mat3 rotY = mat3(
		 sin(ca.y),0, cos(ca.y),
		0,         1,         0,
		-cos(ca.y),0, sin(ca.y)
	);
	vec3 camera = vec3(0,0,camz)*rotX*rotY;
	vec3 plane = (vec3(uv,0)*rotX*rotY);
	
	light.p = vec3(sin(2./3.*PI*2.)*1.5,1,cos(2./3.*PI*2.)*1.5);
	light.c = vec3(0,0,1);
	Light l2 = Light(
		vec3(sin(1./3.*PI*2.)*1.5,1,cos(1./3.*PI*2.)*1.5),
		vec3(1,0,0)
	);
	Light l3 = Light(
		vec3(sin(0.)*1.5,1,cos(0.)*1.5),
		vec3(0,1,0)
	);
	
	Ray r = Ray(camera,camera,normalize(plane-camera),vec3(0),0.);
	
	march(r);
	
	vec3 c = vec3(0);
	
	c += colorDiff(light,r) + bPhong(light,r)*light.c;
	c += colorDiff(l2,r) + bPhong(l2,r)*l2.c;
	c += colorDiff(l3,r) + bPhong(l3,r)*l3.c;
	
	if(r.dist > MAX_DIST) c = vec3(.1);
	
	if(length(r.p-light.p)-.1 <= MIN_DIST) c = light.c*5.;
	if(length(r.p-l2.p)-.1 <= MIN_DIST) c = l2.c*5.;
	if(length(r.p-l3.p)-.1 <= MIN_DIST) c = l3.c*5.;
	
	//c = r.p;
	
	gl_FragColor = vec4( c, 1.0 );

}