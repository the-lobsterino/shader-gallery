// total horse dung

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

struct Ray { vec3 o; vec3 d; };
struct Sphere { vec3 pos; float rad; };
float rsi2_simple(in Ray ray, in Sphere sphere)
{
    vec3 oc = ray.o - sphere.pos;
    float b = 2.0 * dot(ray.d, oc);
    return -b - sqrt(b * b - 4.0 * (dot(oc, oc) - sphere.rad*sphere.rad));
}
vec2 rsi2(in Ray ray, in Sphere sphere)
{
    vec3 oc = ray.o - sphere.pos;
    float b = 2.0 * dot(ray.d, oc);
    float c = dot(oc, oc) - sphere.rad*sphere.rad;
    float disc = b * b - 4.0 * c;
    vec2 ex = vec2(-b - sqrt(disc), -b + sqrt(disc))/2.0;
    return vec2(min(ex.x, ex.y), max(ex.x, ex.y));
}
mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
        oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
        oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c);
}
vec3 getRay(vec2 UV){
	UV = UV * 2.0 - 1.0;
	mat3 rotmat = rotationMatrix(vec3(1.0, 0.0, 0.0), 1.0 - 1.0 +5.0);
	mat3 rotmat2 = rotationMatrix(vec3(0.0, 1.0, 0.0), 0.0 - 1.0 + 2.0);
	return rotmat * rotmat2 * normalize(vec3(UV.x, - UV.y, 1.0));
}
float hash( float n ){
    return fract(sin(n)*758.5453);
}
float noise2d( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y*57.0;
    return mix(
	    mix(hash(n+0.0),hash(n+1.0),f.x),
	    mix(hash(n+57.0),hash(n+58.0),f.x),
	    f.y
	   );
}
float noise3d( in vec3 x ){
	vec3 p = floor(x);
    	vec3 f = smoothstep(0.0, 1.0, fract(x));
	float n = p.x + p.y*157.0 + 113.0*p.z;

	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
		   mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}
float noise4d(vec4 x){
	vec4 p=floor(x);
	vec4 f=smoothstep(0.,1.,fract(x));
	float n=p.x+p.y*157.+p.z*113.+p.w*971.;
	return mix(mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+157.),hash(n+158.),f.x),f.y),
	mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+270.),hash(n+271.),f.x),f.y),f.z),
	mix(mix(mix(hash(n+971.),hash(n+972.),f.x),mix(hash(n+1128.),hash(n+1129.),f.x),f.y),
	mix(mix(hash(n+1084.),hash(n+1085.),f.x),mix(hash(n+1241.),hash(n+1242.),f.x),f.y),f.z),f.w);
}
float FBM2(vec2 p, int octaves, float dx){
	float a = 0.0;
    	float w = 0.5;
	for(int i=0;i<10;i++){
		a += noise2d(p) * w;
        	w *= 0.5;
		p *= dx;
	}
	return a;
}
float FBM3(vec3 p, int octaves, float dx){
	float a = 0.0;
    	float w = 0.5;
	for(int i=0;i<10;i++){
		a += noise3d(p) * w;
        	w *= 0.5;
		p *= dx;
	}
	return a;
}
float FBM4(vec4 p, int octaves, float dx){
	float a = 0.0;
    	float w = 0.5;
	for(int i=0;i<10;i++){
		a += noise4d(p) * w;
        	w *= 0.5;
		p *= dx;
	}
	return a;
}

float rand2s(vec2 co){
    return fract(sin(dot(co.xy * time,vec2(12.9898,78.233))) * 43758.5453);
}

Sphere surface;
Ray cameraRay;
vec3 starColor;
vec2 uvseed;
float planetSize = 2.;
float planetterrain = 0.079;

float getplanetheight(vec3 dir){
	return planetSize + (1.0 - 2.0 * abs(0.5 - FBM3(dir * 10.0, 5, 1.8))) * planetterrain;	
}
vec3 getplanetnormal(vec3 dir){
	mat3 normrotmat1 = rotationMatrix(vec3(0.0,0.0, -1.0), 0.01);
	mat3 normrotmat2 = rotationMatrix(vec3(0.0,1.0, 0.0), 0.01);
	mat3 normrotmat3 = rotationMatrix(vec3(1.0,0.0, 0.0), 0.01);
	vec3 dir2 = normrotmat1 * dir;
	vec3 dir3 = normrotmat2 * dir;
	vec3 dir4 = normrotmat3 * dir;
	vec3 p1 = dir4 * getplanetheight(dir4);
	vec3 p2 = dir2 * getplanetheight(dir2);
	vec3 p3 = dir3 * getplanetheight(dir3);
	return normalize(cross(normalize(p1 - p2), normalize(p1 - p3)));
}
#define PI 3.14159

float nutsack(vec2 uv)
{
    uv.x *= sin(1.+uv.y*.125)*0.5;
    float t =  time*0.3;
    uv.x = uv.x*64.0;
    float dx = fract(uv.x);
    uv.x = floor(uv.x);
    uv.y *= 0.15;
    float o=sin(uv.x*215.4);
    float s=cos(uv.x*33.1)*.3 +.7;
    float trail = mix(145.0,15.0,s);
    float yv = 1.0/(fract(uv.y + t*s + o) * trail);
    yv = smoothstep(0.0,1.0,yv*yv);
    yv = sin(yv*PI)*(s*5.0);
    float d = sin(dx*PI);
    return yv*(d*d);
}

#define hits(a) (a>0.0&&a<999.0)
#define seed 13.0
vec4 tracePlanet(float size)
{
	surface = Sphere(vec3(-3.0), size);
	vec3 color =  vec3(1.11,0.9,0.9)*nutsack(uvseed*2.5);	////vec3(0.0);
	starColor = vec3(0.7)+vec3(hash(seed), hash(seed + 100.0), hash(seed + 200.0));
	
	float hit_Surface = rsi2(cameraRay, surface).x;
	if(!hits(hit_Surface)) return vec4(color*(0.1+sin(time*2.2)*0.02),1.0);
	if(hits(hit_Surface))
	{
		vec3 norm = getplanetnormal(normalize((cameraRay.o + cameraRay.d * hit_Surface) - vec3(-3.0)));
		color = vec3(0.84,0.5,0.2)*max(0.0, dot(norm, normalize(vec3(0.0) - (cameraRay.o + cameraRay.d * hit_Surface))));
	}
	
	
	return vec4(color, 1.0);
}

float starSize = 2.0;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.y );
	if (position.y < 0.1 || position.y > 0.9)
		gl_FragColor=vec4(0.05,0.01,0.1,0.0);

	else
	{
	position.y += 0.2;
	position.x -= 0.2;
		position.x = mod(position.x+time*0.1,0.7)+0.35;
	uvseed = position;
	cameraRay = Ray(vec3(0.0,0.0, -3.0), getRay(position*0.9));
	gl_FragColor = tracePlanet(starSize);
	}

}