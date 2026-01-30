//--------------------------------------------------
// RayMarch framework v0.12 - Lighting
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// (c) 2014 http://shad.mobi/
//
// Thanks for IQ for useful article 
// about raymarch technology
// http://www.iquilezles.org/
//--------------------------------------------------
#ifdef GL_ES
	precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define RENDER_MODE 2
#define CAMERA_MODE 6
#define SHADOW_MODE 0
#define ENABLE_LIGHT 1
#define ENABLE_AO 1
#define ENABLE_MATERIAL 1
#define ENABLE_TEXTURE 1
#define ENABLE_SKY 1
#define ENABLE_SUN 1

const float PI=3.14159;
const int MAX_STEPS=128;
const float STEPS_DELTA=1.0 / 32.;
const float MAX_DISTANCE=100.0;
const float DISTANCE_BOOST=1.0;
const float EPSILON=0.01;
const float NORMAL_EPSILON=0.001;

const float SHADOW_EPSILON=0.001;
const int SHADOW_ITERATION=8;
const float SHADOW_POINT=0.1;
const float SHADOW_MIN_DISTANCE=0.0;
const float SHADOW_MAX_DISTANCE=8.0;
const float SHADOW_BLUR=1.0;
const float SHADOW_DELTA=0.1;
const float SHADOW_BOOST=1.0;

const int AO_ITERATION=5;
const float AO_START=0.05;
const float AO_STEP=0.1;
const float AO_BLUR_START=0.70;
const float AO_BLUR=0.75;

vec2 box(vec3 p, vec3 pos, vec3 size, float material);
vec2 sphere(vec3 p, vec3 pos, float radius, float material);
vec2 plane(vec3 p, vec3 pos, vec3 normal, float material);
vec2 roundBox(vec3 p, vec3 pos, vec3 size, float radius, float material);
vec2 torus( vec3 p, vec3 pos, vec2 t, float material);
vec2 hexPrism(vec3 p, vec3 pos, vec2 h, float material);
vec2 triPrism( vec3 p, vec3 pos, vec2 h, float material);
vec2 capsule( vec3 p, vec3 pos, vec3 a, vec3 b, float r, float material);
vec2 torus82(vec3 p, vec3 pos, vec2 t, float material);
vec2 torus88(vec3 p, vec3 pos, vec2 t, float material);
vec2 cylinder6(vec3 p, vec3 pos, vec2 h, float material);
vec2 cross3D(vec3 p, vec3 pos, float size, float thick, float material);
vec2 smothJoin(vec2 a, vec2 b, float k );
vec2 join(vec2 a, vec2 b);
vec2 join(vec2 a, vec2 b, vec2 c);
vec2 intersect(vec2 a, vec2 b);
vec2 intersect(vec2 a, vec2 b, vec2 c);
vec2 diff(vec2 a, vec2 b);
vec2 diff(vec2 a, vec2 b, vec2 c);
vec3 repetition(vec3 pos, vec3 c);
vec3 scale(vec3 p, float s);
vec3 rotateX(vec3 p, float angle);
vec3 rotateY(vec3 p, float angle);
vec3 rotateZ(vec3 p, float angle);
vec3 rotateX(vec3 p, float sinus, float cosinus);
vec3 rotateY(vec3 p, float sinus, float cosinus);
vec3 rotateZ(vec3 p, float sinus, float cosinus);
vec3 twist(vec3 p, float tc, float ts );
vec3 bend(vec3 p, float tc, float ts );
vec2 sinDisplace(vec3 p, vec2 primitive, float steps, float scale);
vec2 sinDisplace(vec3 p, vec2 primitive, float steps, float scale, float tim);

//-------------------------------------
// Data structures
//-------------------------------------
struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
	int texture;
};

struct Object {
	float distance;
	float step;
	float grey;
	vec3 pos;
	vec3 normal;
	bool hit;
	Material mat;
};

struct Light {
	vec3 posistion;
	vec3 ambientColor;
	vec3 color;
};

struct Sun {
	vec3 posistion;
	vec3 color;
	float haloSize;
	float haloPower;
	float discSize;
	float discPower;
	float discArea;
	float horizontal;
};
Sun sunLight=Sun(vec3(-0.2, 0.1,  -0.4),vec3(1.0,1.0,1.0), 100.0, 0.3, 100.0, 1.5, 0.9, 5.0);

//-------------------------------------
// Map function
// Return 2 dimensional vector, where:
// x - distance
// y - material ID
//-------------------------------------
vec2 map(vec3 p) {
	float tmpo = time*1e-3 + atan(p.y, p.x)*1.7e1*surfacePosition.y + surfacePosition.x;
	vec2 hit=plane(p, vec3(0.0, -0.5, 0.0), vec3(0.1, 1.0, 0.1), 0.0);
	vec2 cube=roundBox(p, vec3(cos(tmpo * 0.2) * 1.0, 1.0, sin(tmpo * 0.2) * 2.0), vec3(0.3), 0.3, 2.);
	vec2 cube2=roundBox(p, vec3(cos(tmpo * 0.2) * 1.0, sin(tmpo * 1.0) * 1.0, sin(tmpo * 0.2) * 2.0), vec3(0.3), 0.3, 3.);
	vec2 cube3=roundBox(p, vec3(cos(tmpo * 0.2) * 2.0, cos(tmpo * 1.0) * 1.0, sin(tmpo * 0.2) * 1.0), vec3(0.3), 0.3, 4.);
	vec2 ball1=sphere(p, vec3(1.0 + cos(tmpo * 0.5) * 2.5, 1.0 + cos(tmpo * 0.5) * 0.4, sin(tmpo * 0.5) * 0.5), 0.7 + sin(tmpo * 2.0) * 0.3, 2.);
	vec2 ball2=sphere(p, vec3(1.0 + sin(tmpo * 0.4) * 0.5, 1.0 + sin(tmpo * 0.5) * 1.4, cos(tmpo * 0.3) * 0.5), 0.6 + sin(tmpo * 1.0) * 0.3, 3.);
	cube=smothJoin(cube, cube2, 0.5);
	cube=smothJoin(cube, cube3, 0.5);
	cube=smothJoin(cube, ball1, 0.5);
	cube=smothJoin(cube, ball2, 0.5);
	
	hit=join(hit,cube);
	return hit;
}

vec3 getSky(Object sceneObject, vec3 ray, vec3 rayDir){

	vec3 skyColor=vec3(0.0);
	#if ENABLE_SKY==1
		float horizontHeight = pow(1.0-max(rayDir.y,0.0), sunLight.horizontal);
		skyColor=mix(vec3(0.0, 0.0, 0.5), vec3(1.0, 0.0, 0.0), horizontHeight);
	#endif
	#if ENABLE_SUN==1
		float sunAmount = max(dot(rayDir, normalize(sunLight.posistion)), 0.0);
		// Sun Halo
		skyColor = skyColor + sunLight.color * pow(sunAmount, sunLight.haloSize) * sunLight.haloPower;
		// Sun Disc
		skyColor = skyColor + sunLight.color * min(pow(sunAmount, sunLight.discSize) * sunLight.discPower, sunLight.discArea);
	#endif
	
	return clamp(skyColor, 0.0, 1.0);
}

#if ENABLE_MATERIAL==1
	Material materials[9];
	void  defineMaterials(){
		materials[0]=Material(vec3(0.0, 0.0, 0.0), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), 16., 1);
		materials[1]=Material(vec3(0.0, 0.0, 0.0), vec3(0.6, 0.6, 0.6), vec3(1.0, 0.0, 0.0), 16., 3);
		materials[2]=Material(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[3]=Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[4]=Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[5]=Material(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[6]=Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[7]=Material(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 1.0), vec3(1.0, 1.0, 1.0), 16., 0);
		materials[8]=Material(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.5, 0.0), vec3(1.0, 1.0, 1.0), 16., 0);
	}
#endif

float length2( vec2 p ) {
	return sqrt(p.x * p.x + p.y * p.y);
}

float length6( vec2 p ) {
	p=p * p * p;
	p=p * p;
	return pow(p.x + p.y, 1.0 / 6.0);
}

float length8( vec2 p ) {
	p=p * p;
	p=p * p;
	p=p * p;
	return pow(p.x + p.y, 1.0 / 8.0);
}


//-------------------------------------
// RayMarch primitive object 
// (procedural function)
//-------------------------------------
vec2 box(vec3 p, vec3 pos, vec3 size, float material) {
	vec3 d=abs(p - pos) - size;
	float distance=min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
	return vec2(distance, material);
}
vec2 sphere(vec3 p, vec3 pos, float radius, float material) {
	return vec2(length(p - pos) - radius, material);
}
vec2 plane(vec3 p, vec3 pos, vec3 normal, float material) {
	return vec2(dot(p - pos, normal), material);
}
vec2 roundBox(vec3 p, vec3 pos, vec3 size, float radius, float material) {
	return vec2(length(max(abs(p - pos) - size, 0.0)) - radius, material);
}
vec2 torus( vec3 p, vec3 pos, vec2 t, float material) {
	p=p - pos;
	vec2 q=vec2(length(p.xy) - t.x, p.z);
	return vec2(length(q) - t.y, material);
}
vec2 hexPrism(vec3 p, vec3 pos, vec2 h, float material) {
	vec3 q=abs(p - pos);
	return vec2(max(q.z - h.y, max(q.x + q.y * 0.57735, q.y * 1.1547) - h.x), material);
}
vec2 triPrism( vec3 p, vec3 pos, vec2 h, float material) {
	vec3 q=abs(p - pos);
	return vec2(max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5), material);
}
vec2 capsule( vec3 p, vec3 pos, vec3 a, vec3 b, float r, float material) {
	p=p - pos;
	vec3 pa=p - a;
	vec3 ba=b - a;
	float h=clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return vec2(length(pa - ba * h) - r, material);
}
vec2 torus82(vec3 p, vec3 pos, vec2 t, float material) {
	p=p - pos;
	vec2 q=vec2(length2(p.xz) - t.x, p.y);
	return vec2(length8(q) - t.y, material);
}
vec2 torus88(vec3 p, vec3 pos, vec2 t, float material) {
	p=p - pos;
	vec2 q=vec2(length8(p.xz) - t.x, p.y);
	return vec2(length8(q) - t.y, material);
}

vec2 cylinder6(vec3 p, vec3 pos, vec2 h, float material) {
	p=p - pos;
	return vec2(max(length6(p.xz) - h.x, abs(p.y) - h.y), material);
}

//-------------------------------------
// Mixing object
//-------------------------------------
vec2 cross3D(vec3 p, vec3 pos, float size, float thick, float material) {
	p=p - pos;
	vec2 obj1=box(p.xyz, vec3(0.0,0.0,0.0), vec3(size,thick,thick), material);
	vec2 obj2=box(p.yzx, vec3(0.0,0.0,0.0), vec3(thick,size,thick), material);
	vec2 obj3=box(p.zxy, vec3(0.0,0.0,0.0), vec3(thick,thick,size), material);
	return vec2(min(obj1.x,min(obj2.x, obj3.x)), material);
}


//-------------------------------------
// Operation
//-------------------------------------
vec2 smothJoin(vec2 a, vec2 b, float k ) {
	float h=clamp(0.5 + 0.5 * (b.x - a.x) / k, 0.0, 1.0);
	float distance=mix(b.x, a.x, h) - k * h * (1.0 - h);
	a.x=distance;
	if (h < 0.5){
		a.y=b.y;
	}
	return a;
}

vec2 join(vec2 a, vec2 b) {
	if (a.x > b.x){
		return b;
	}
	return a;
}
vec2 join(vec2 a, vec2 b, vec2 c) {
	if (a.x > b.x){
		if (b.x > c.x){
			return c;
		}
		return b;
	}
	if (a.x > c.x){
		return c;
	}
	return a;
}

vec2 intersect(vec2 a, vec2 b) {
	if (a.x > b.x){
		return a;
	}
	return b;
}
vec2 intersect(vec2 a, vec2 b, vec2 c) {
	if (a.x > b.x){
		if (c.x > a.x){
			return c;
		}
		return a;
	}
	if (c.x > b.x){
		return c;
	}
	return b;
}
vec2 diff(vec2 a, vec2 b) {
	b.x=-b.x;
	if (b.x > a.x){
		return b;
	}
	return a;
}

vec2 diff(vec2 a, vec2 b, vec2 c) {
	b.x=-b.x;
	if (b.x > a.x){
		c.x=-c.x;
		if (c.x > c.x){
			return c;
		}
		return b;
	}
	if (b.x > c.x){
		a.x=-a.x;
		if (a.x > c.x){
			return a;
		}
		return c;
	}
	c.x=-c.x;
	if (c.x > a.x){
		return c;
	}
	return a;
}

vec3 repetition(vec3 pos, vec3 c) {
	return mod(pos, c) - 0.5 * c;
}
vec3 scale(vec3 p, float s) {
	// return primitive(p/s)*s;
	return (p / s) * s;
}

vec3 rotateX(vec3 p, float angle) {
	float c=cos(angle);
	float s=sin(angle);
	return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}
vec3 rotateY(vec3 p, float angle) {
	float c=cos(angle);
	float s=sin(angle);
	return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}
vec3 rotateZ(vec3 p, float angle) {
	float c=cos(angle);
	float s=sin(angle);
	return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

vec3 rotateX(vec3 p, float sinus, float cosinus) {
	return vec3(p.x, cosinus * p.y - sinus * p.z, sinus * p.y + cosinus * p.z);
}
vec3 rotateY(vec3 p, float sinus, float cosinus) {
	return vec3(cosinus * p.x - sinus * p.z, p.y, sinus * p.x + cosinus * p.z);
}
vec3 rotateZ(vec3 p, float sinus, float cosinus) {
	return vec3(cosinus * p.x - sinus * p.y, sinus * p.x + cosinus * p.y, p.z);
}
vec3 twist(vec3 p, float tc, float ts ) {
	float c=-1. * cos(tc * p.y + ts);
	float s=1. * sin(tc * p.y + ts);
	mat2 m=mat2(c, -s, s, c);
	return vec3(m * p.xz, p.y);
}
vec3 bend(vec3 p, float tc, float ts ) {
	float c=-1. * cos(tc * p.y + ts);
	float s=1. * sin(tc * p.y + ts);
	mat2 m=mat2(c, -s, s, c);
	return vec3(m * p.xy, p.z);
}

//-------------------------------------
// Displacement map
//-------------------------------------
vec2 sinDisplace(vec3 p, vec2 primitive, float steps, float scale) {
	primitive.x+=(sin(steps * p.x) * sin(steps * p.y) * sin(steps * p.z)) * scale;
	return primitive;
}
vec2 sinDisplace(vec3 p, vec2 primitive, float steps, float scale, float tim) {
	primitive.x+=(sin(steps * p.x + tim) * sin(steps * p.y + tim) * sin(steps * p.z + tim)) * scale;
	return primitive;
}

//-------------------------------------
// Ray Marching
//-------------------------------------
vec3 pointNormal(vec3 pos) {
	vec3 eps=vec3(NORMAL_EPSILON, 0.0, 0.0);
	vec3 nor=vec3(
			map(pos + eps.xyy).x - map(pos - eps.xyy).x, 
			map(pos + eps.yxy).x - map(pos - eps.yxy).x, 
			map(pos + eps.yyx).x - map(pos - eps.yyx).x
	);
	return normalize(nor);
}

Object rayMarching(vec3 ray, vec3 rayDir) {

	float distance=0.0;
	Object sceneObject;
	vec2 mapOut;

	sceneObject.hit=false;

	for(int i=0; i < MAX_STEPS; ++i) {

		mapOut=map(ray);
		ray += rayDir * mapOut.x;
		distance += mapOut.x;
		sceneObject.step += STEPS_DELTA;

		if (mapOut.x < EPSILON){
			sceneObject.hit=true;
			distance=0.0;
			break;
		}
		if (distance > MAX_DISTANCE){
			sceneObject.hit=false;
			distance=MAX_DISTANCE;
			break;
		}
	}

	sceneObject.distance=distance / MAX_DISTANCE;
	sceneObject.pos=ray;
	sceneObject.grey=1.0 - sceneObject.distance;

	if (sceneObject.hit){
		sceneObject.normal=pointNormal(ray);

		//
		// Assign material to object
		//
		#if ENABLE_MATERIAL==1
			int matIndex=int(floor(mapOut.y));
			for(int i=0; i < 9; i++) {
				if (matIndex == i){
					sceneObject.mat=materials[i];
					break;
				}
			}
		#else		
			sceneObject.mat.ambient=vec3(0.1);
			sceneObject.mat.diffuse=vec3(0.5);
			sceneObject.mat.specular=vec3(1.0);
			sceneObject.mat.shininess=8.0;
		#endif
	}
	return sceneObject;
}

//-------------------------------------
// Light, shadows
//-------------------------------------

void pointLight(inout vec3 lightColor, inout vec3 lightSpecular, Light light, Object sceneObject) {
	vec3 lightDir=normalize(light.posistion - sceneObject.pos);
	float lightPower=dot(sceneObject.normal, lightDir);
	lightColor=clamp(lightColor+light.ambientColor + light.color * lightPower, 0.0, 1.0);
	
	if (sceneObject.mat.shininess > 0.0){
		vec3 reflect = reflect(lightDir, sceneObject.normal);
		float specural=pow(max(0.,dot(lightDir,-reflect)), sceneObject.mat.shininess);
		float specural2=pow(lightPower, sceneObject.mat.shininess);
		float specural3=pow(max(0.,dot(lightDir,-reflect)) * 10., sceneObject.mat.shininess);
		lightSpecular=clamp(lightSpecular+light.color * specural, 0.0, 1.0);
	}
}

float pointShadow(in vec3 ro, in vec3 rd) {
	float t=SHADOW_MIN_DISTANCE;
	for(int i=0; i < SHADOW_ITERATION; i++) {
		float h=map(ro + rd * t).x;
		if (h < SHADOW_EPSILON){
			return 0.0;
		}
		t += h * SHADOW_BOOST;
		if (t > SHADOW_MAX_DISTANCE){
			break;
		}
	}
	return 1.0;
}

float pointSoftShadow(in vec3 ro, in vec3 rd, float k) {
	float res=1.0;
	float t=SHADOW_MIN_DISTANCE;
	for(int i=0; i < SHADOW_ITERATION; i++) {
		float h=map(ro + rd * t).x;
		if (h < SHADOW_EPSILON){
			return 0.0;
		}
		res=min(res, k * h / t);
		t += SHADOW_DELTA + h * SHADOW_BOOST;
		if (t > SHADOW_MAX_DISTANCE){
			break;
		}
	}
	return res;
}

//
// Ambient occlusion
//
float pointAO(in vec3 pos, in vec3 nor) {
	float totao=0.0;
	float sca=AO_BLUR_START;
	for(int aoi=0; aoi < AO_ITERATION; aoi++) {
		float hr=AO_START + AO_STEP * float(aoi);
		vec3 aoPos=nor * hr + pos;
		float distance=map(aoPos).x;
		totao += -(distance - hr) * sca;
		sca *= AO_BLUR;
	}
	return clamp(1.0 - 4.0 * totao, 0.0, 1.0);
}


//-------------------------------------
// Texture
//-------------------------------------
vec3 debugSteps(float distance) {
	return vec3(
			(distance < 0.25) ? 1. - distance * 4. : ((distance > 0.24 && distance < 0.50) ? 0.0 + distance * 2. : 0.), 
			(distance < 0.25) ? 1. - distance * 4. : ((distance > 0.49 && distance < 0.75) ? distance * 1.2 : 0.), 
			(distance < 0.15) ? 1. - distance * 4. : ((distance > 0.75) ? distance : 0.)
	);
}

vec3 checkers(vec3 pos, vec3 normal, float size) {
	vec3 p=cross(pos, normal);
	float c=floor(mod((p.x / size) + floor(p.y / size) + floor(p.z / size), 2.0)) * size;
	return vec3(clamp(c, 0.3, 1.0));
}

vec3 distancecolor(vec3 pos, vec3 normal) {
	return normalize(pos);
}

vec3 plasma(vec3 pos, vec3 normal) {
	return vec3(
		pos.x * sin(pos.y * 50. + time / 0.4), 
		pos.y * cos(pos.z * 10. + time / 0.2), 
		pos.x * sin(pos.y * 15. + time / 0.10)
	);
}

void main() {

	vec2 pos=(gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	vec2 uv=gl_FragCoord.xy/resolution.xy;

	//
	// Light config
	//
	Light light1;
	light1.posistion=vec3(sin(time * 0.95) * 3.0, 5.0, cos(time * 0.65) * 5.0);
	light1.ambientColor=vec3(0.1, 0.1, 0.1);
	light1.color=vec3(1.0, 0.5, 0.3);
	
	Light light2;
	light2.posistion=vec3(sin(time * 0.55) * 4.0, 5.0, cos(time * 0.95) * 4.0);
	light2.ambientColor=vec3(0.1, 0.1, 0.1);
	light2.color=vec3(0.3, 0.5, 1.0);
	
	//
	// Material config
	//
	#if ENABLE_MATERIAL==1
		defineMaterials();
	#endif
	//
	// Camera config
	//
	#if CAMERA_MODE==0
		vec3 camPos=vec3(4.0, 2.0, 5.0);
		vec3 camTarget=vec3(0.0, 0.0, 0.0);
	#elif CAMERA_MODE==1
		vec3 camPos=vec3(8.0, 4.0, 8.0);
		vec3 camTarget=vec3(0.0, 0.0, 0.0);
	#elif CAMERA_MODE==2
		vec3 camPos=vec3(0.05, 0.05, 0.1);
		vec3 camTarget=vec3(0.0, 0.1, 0.0);
	#elif CAMERA_MODE==3
		vec3 camPos=vec3(mouse.x, mouse.y, 5.0);
		vec3 camTarget=vec3(0.0, 0.0, 0.0);
	#elif CAMERA_MODE==4
		vec3 camPos=vec3(-sin(time / 10.0) * 5.0, 5, cos(time / 10.0) * 5.0);
		vec3 camTarget=vec3(0.0, 0.0, 0.0);
	#elif CAMERA_MODE==5
		vec3 camPos=vec3(0.0, 1.2, 0.0);
		vec3 camTarget=vec3(-sin(time / 10.0) * 5.0, cos(time / 4.0) * 3.0, cos(time / 10.0) * 5.0);
	#else
		vec3 camPos=vec3(cos(time * 0.5) * 4., 3. + sin(time * 0.5) * 3., 4.0);
		vec3 camTarget=vec3(0.0, 0.0, 0.0);
	#endif
	//
	// Calculate camera vectors
	//
	vec3 camUp=normalize(vec3(0.0, 1.0, 0.0));
	vec3 camDir=normalize(camTarget - camPos);
	vec3 camSide=cross(camDir, camUp);
	float focus=1.8;

	vec3 rayDir=normalize(camSide * pos.x + camUp * pos.y + camDir * focus);
	vec3 ray=camPos;

	//
	// RayMarching
	//
	Object sceneObject=rayMarching(ray, rayDir);
	
	//
	// Color process
	//
	vec3 outColor=vec3(0.0, 0.0, 0.0);
	if (sceneObject.hit){
		#if RENDER_MODE==0
			outColor=sceneObject.mat.diffuse;
		#elif RENDER_MODE==1	
			outColor=sceneObject.mat.diffuse * sceneObject.grey;
		#elif RENDER_MODE==2
			outColor=vec3(sceneObject.grey);
		#elif RENDER_MODE==3	
			outColor=sceneObject.normal;
		#elif RENDER_MODE==4	
			outColor=vec3(sceneObject.distance);
		#elif RENDER_MODE==5	
			outColor=sceneObject.pos;
		#endif			
		#if ENABLE_TEXTURE
			if (sceneObject.mat.texture == 1){
				outColor=outColor * checkers(sceneObject.pos, sceneObject.normal, 2.0);
			} else if (sceneObject.mat.texture == 2){
				outColor=outColor * distancecolor(sceneObject.pos, sceneObject.normal);
			} else if (sceneObject.mat.texture == 3){
				outColor=outColor * plasma(sceneObject.pos, sceneObject.normal);
			}
		#endif
		#if ENABLE_LIGHT
			vec3 lightColor=vec3(0.0);
			vec3 lightSpecular=vec3(0.0);
			pointLight(lightColor, lightSpecular, light1, sceneObject);
			pointLight(lightColor, lightSpecular, light2, sceneObject);
		#else
			vec3 lightColor=vec3(1.0);
			vec3 lightSpecular=vec3(0.0);
		#endif	

		float baseShadow=1.0;
		#if ENABLE_AO
			float ao=pointAO(sceneObject.pos, sceneObject.normal);
			baseShadow=baseShadow * ao;
		#endif			
		#if SHADOW_MODE==1
			baseShadow *= pointShadow(sceneObject.pos + SHADOW_POINT * sceneObject.normal, light1.posistion);
			baseShadow *= pointShadow(sceneObject.pos + SHADOW_POINT * sceneObject.normal, light2.posistion);
		#endif
		#if SHADOW_MODE==2
			baseShadow *= pointSoftShadow(sceneObject.pos + SHADOW_POINT * sceneObject.normal, light1.posistion, SHADOW_BLUR);
			baseShadow *= pointSoftShadow(sceneObject.pos + SHADOW_POINT * sceneObject.normal, light2.posistion, SHADOW_BLUR);
		#endif

		outColor=sceneObject.mat.ambient + outColor * lightColor * baseShadow + sceneObject.mat.specular * lightSpecular;
	} else {
		outColor=getSky(sceneObject, ray, rayDir);	
	}

	gl_FragColor=vec4(outColor.r, outColor.g, outColor.b, 1.0);
}