#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265
#define MAX_DIST 10.
#define MIN_DIST .0001
#define MAX_STEP  128

#define LI 4
#define SP 2
#define CU 2

struct Ray {
	vec3 o;
	vec3 p;
	vec3 dir;
	float dist;
};

struct Sphere {
	vec4 p;// xyz r
};
	
struct Cube {
	vec3 p;
	vec3 s;
};

struct Light {
	vec3 p;
	vec3 c;
	vec3 L;
};

Light light[LI];
Sphere sp[SP];
Cube cu[CU];

vec3 N = vec3(0);
vec3 V = vec3(0);

float cubeSDF(vec3 p,Cube c){
	vec3 C = abs(p-c.p)-c.s;
	return length(max(C,0.)) + min(0.,max(C.x,max(C.y,C.z)));
}

float sphereSDF(vec3 p,Sphere sp){
	return length(p - sp.p.xyz) - sp.p.w;
}

float dist(vec3 p){
	float d = 0.;
	
	d = max(
		-sphereSDF(p,sp[1]),
		cubeSDF(p,cu[0])
	);
	d = min(sphereSDF(p,sp[0]),d);
	d = min(cubeSDF(p,cu[1]),d);
	
	return d;
}

float lightDist(vec3 p,float d){
	for(int i = 0;i<LI;i++)
		d = min(d,length(p-light[i].p)-.1);
	return d;
}

void march(inout Ray r,int t){
	for(int i = 0;i<MAX_STEP;i++){
		r.p = r.o + r.dist*r.dir;
		float d = dist(r.p);
		d = t == 0 ? d : min(d,lightDist(r.p,d));
		if(d <= MIN_DIST || d > MAX_DIST)break;
		r.dist += d;
	}
}

vec3 sNormal(vec3 p){
	vec2 t = vec2(MIN_DIST*10.,0);
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
	float d = diffuse(r.p,l.L);
	
	c += l.c * d;
	
	return c;
}

float bPhong(Light l,Ray r){
	float c = 0.;
	float d = diffuse(r.p,l.L);
	
	c += pow(max(dot(normalize(l.L+V),N),0.),500.)*2. * d;
	
	return c;
}

float shadowMask(vec3 p,vec3 l){
	float m = 1.;
	float x = 1.;
	Ray r = Ray(p+N*MIN_DIST*x,p+N*MIN_DIST*x,normalize(l-p),0.);
	march(r,0);
	if(r.dist < length(l-p))m = .5;
	return m;
}

void lNormal(inout Light l,Ray r){
	l.L = normalize(l.p-r.p);
}

vec3 getColor(Light l,Ray r){
    return ((colorDiff(l,r) + bPhong(l,r)*l.c) * vec3(shadowMask(r.p,l.p)))/length(l.p-r.p);
}

void initObj(){
	cu[0].p = vec3(0,0,0);
	cu[0].s = vec3(1);
	
	cu[1].p = vec3(0,-1.01,0);
	cu[1].s = vec3(3.,.01,3.);
	
	sp[0].p = vec4(0,0,0,.5);
	
	sp[1].p = vec4(0,0,0,1.3);
}

void main( void ){
	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	uv.x*= resolution.x/resolution.y;
	uv*=2.;
	vec2 m = mouse*2.-1.;
	m =vec2(time*.1,-abs(sin(time/12.)*.6));
	//m = vec2(-.4);
	
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
	
	light[0].p = vec3(sin(2./3.*PI*2.)*2.,0,cos(2./3.*PI*2.)*2.);
	light[0].c = vec3(0,0,1);
	
	light[1].p = vec3(sin(1./3.*PI*2.)*2.,0,cos(1./3.*PI*2.)*2.);
	light[1].c = vec3(1,0,0);
	
	light[2].p = vec3(sin(0.)*2.,0,cos(0.)*2.);
	light[2].c = vec3(0,1,0);
    
	light[3].p = vec3(0,3,0)*rotX*rotY;
	light[3].c = vec3(2);
	
	Ray r = Ray(camera,camera,normalize(plane-camera),0.);
	
	initObj();
	march(r,0);
	
	vec3 c = vec3(0.);
	N = sNormal(r.p);
	V = -r.dir;
	
	for(int l = 0;l<LI;l++){
		lNormal(light[l],r);
		c += getColor(light[l],r);
		if(length(r.p-light[l].p)-.1 <= MIN_DIST) c = light[l].c;
	}
		
	if(r.dist > MAX_DIST) c = vec3(.1);
	
	
	gl_FragColor = vec4( c, 1.0 );

}