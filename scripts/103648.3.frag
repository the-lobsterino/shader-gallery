#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265

vec3 light = vec3(0);

struct Ray {
	vec3 camera;
	vec3 pos;
	vec3 dir;
	vec3 color;
	float dist;
};

struct Sphere {
	vec3 pos;
	vec3 color;
	float r;
};
	
struct Cube {
	vec3 pos;
	vec3 color;
	vec3 size;
};

struct Light {
	vec3 pos;
	vec3 color;
};

float cubeDist(vec3 pos,vec3 cu,vec3 r){
	
	cu = abs(pos)-cu;
	
	return max(max(cu.x-r.x,cu.y-r.y),cu.z-r.z);
}


vec3 sNormal(vec3 p){
	vec2 t = vec2(.001,0);
	float d = cubeDist(p,vec3(0),vec3(1,.5,2));
	
	return normalize(d - vec3(
		cubeDist(p-t.xyy,vec3(0),vec3(1,.5,2)),
		cubeDist(p-t.yxy,vec3(0),vec3(1,.5,2)),
		cubeDist(p-t.yyx,vec3(0),vec3(1,.5,2))
	));
}

vec3 shadeCube(Ray r,vec3 cuPos,vec3 cuSize){
	vec3 c = vec3(0);
	vec3 normalCube = sNormal(r.pos);
	
	float diffuse = max(dot(normalCube,normalize(light-r.pos)),0.);
	c += diffuse ;
	c += pow(dot(normalCube,normalize(normalize(light-r.pos)+normalize(-r.dir))),100.)*diffuse;
	c = max(c,0.);
	c += normalCube;
	return c;
}

vec3 march(Ray r){
	const int max_step = 128;
	const float mindist = .001;
	const float maxdist = 1000.;
	vec3 nothit = vec3(.1);
	for(int st = 0;st<max_step;st++){
		r.pos = r.camera + r.dist * r.dir;
		
		float dist = cubeDist(r.pos,vec3(0),vec3(1,.5,2));
		dist = min(dist,length(light-r.pos)-.2);
		
		if( dist <= mindist){
			if(dist == length(light-r.pos)-0.2) return vec3(1);
			return shadeCube(r,vec3(0),vec3(1));
		}
		
		if( dist > maxdist){
			return nothit;
		}
		r.dist += dist;
	}
	return nothit;
}

mat2 rot2d(float an){
	return mat2(
		sin(radians(an)),cos(radians(an)),
		-cos(radians(an)),sin(radians(an))
	);
}

Ray initRay(vec3 camera,vec3 plane){
	Ray ray;
	ray.camera = camera;
	ray.pos += ray.camera;
	ray.dir = normalize(plane-ray.camera);
	ray.color = vec3(0);
	ray.dist = 0.;
	return ray;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	uv.x*= resolution.x/resolution.y;
	uv*=2.;
	vec2 m = mouse *2.-1.;
	m.x*= resolution.x/resolution.y;
	
	float camz = 4.;
	vec3 ca = vec3(
		PI*m.y+PI/2.,
		PI*m.x+PI/2.,
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
	
	Ray ray = initRay(camera,plane);
	
	light = vec3(2.,1,3);

	vec3 color = vec3(0);
	
	color += march(ray);

	gl_FragColor = vec4( color, 1.0 );

}