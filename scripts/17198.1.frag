#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float PI = 3.141592653589793238462643383279;
const float HALT = 0.00001;
const int ITERATIONS = 200;


vec3 reflection(vec3 normal, vec3 direction){
	return -2.0 * dot(normal,direction) * normal + direction;	
}

mat4 translate(vec3 pos){
	mat4 r;
	r[0] = vec4(1,0,0,0);
	r[1] = vec4(0,1,0,0);
	r[2] = vec4(0,0,1,0);
	r[3] = vec4(pos,1);
	
	return r;
}

mat4 scale(vec3 scale){
	mat4 r;
	
	r[0] = vec4(scale.x,0,0,0);
	r[1] = vec4(0,scale.y,0,0);
	r[2] = vec4(0,0,scale.z,0);
	r[3] = vec4(0,0,0,1);
	
	return r;
}

float adSphere(vec3 p, float s){
	return length(p) -s;	
}

float udBox( vec3 p, vec3 b ){
	return length(max(abs(p)-b,0.0));
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}

float opS( float d1, float d2 )
{
    return max(-d1,d2);
}

float opI( float d1, float d2 )
{
    return max(d1,d2);
}

struct Light{
	vec3 pos;
	vec3 color;
	float intensity;
};
	
Light light1;
Light light2;
Light lightSun;

struct Ray{
	vec3 dir;
	vec3 pos;
};

float sphereAt(vec3 position, float radius, vec3 center){	
	return adSphere(position-center,radius);
}
	
float sphere2(vec3 position){
	float s1 = sphereAt(position,0.25,vec3(0.0,0.25,0.0));
	float s2 = sphereAt(position,0.25,vec3(0.0,-0.25,0.0));
	return opU(s1,s2);
}

float sphereCube(vec3 position){
	float s1 = sphere2(position+vec3(0.25,0.0,0.25));
	float s2 = sphere2(position+vec3(-0.25,0.0,0.25));
	float s3 = sphere2(position+vec3(-0.25,0.0,-0.25));
	float s4 = sphere2(position+vec3(0.25,0.0,-0.25));
	
	return opU(opU(s1,s2),opU(s3,s4));
}

float sphereslol(vec3 position){
	
	float minRes = 10000.0;
	
	for(int i = 0; i < 10; i++){
		float a = float(i);
	
		float x = 2.0*cos(time+10.0*a);
		float z = -6.0 + 3.0*sin(time+10.0*a);
	
	
	
		minRes = min(minRes, sphereAt(position, 0.8, vec3(x,-a,z)));	
	}
		
	return minRes;
	
}

float dalCons(vec3 position){
	float d1 = sphereCube(position+vec3(0,0,2));
	float d2 = udBox(position +vec3(0,0,2),vec3(0.6,0.5,0.4));
	return opU(d1,d2);
}
	
float constr(vec3 position){
	float distance1 = adSphere(position+vec3(0.0,0.0,2.0), 0.6);
	float distance2 = udBox(position+vec3(0.0,0.0,2.0),vec3(0.5));
	return opU(distance1,distance2);	
}
	
float findDistance(vec3 position){	
	
	float distanceToFloor = ( 2.0 - position.y);
	
	vec3 c = vec3(1.5,1.5,8.6);
	
	vec3 q = mod(position+vec3(9.3),c)-0.5*c;
	
	if(-position.y > 8.0){
		q.y = position.y;	
	}
	//q.x = position.x;
	//q.z = position.z+4.0;
	
	
	float d1 = dalCons(q);		
	float d2 = opS(sphereslol(position),d1);

	return opU(d2,distanceToFloor);
}

vec3 grad(vec3 position){
	float eps = 0.0005;
	return normalize(vec3(	findDistance(position + vec3(eps,0.0,0.0)) - findDistance(position - vec3(eps,0.0,0.0)),
			 	findDistance(position + vec3(0.0,eps,0.0)) - findDistance(position - vec3(0.0,eps,0.0)),
			 	findDistance(position + vec3(0.0,0.0,eps)) - findDistance(position - vec3(0.0,0.0,eps))));
}

vec3 findNormal(vec3 position){
	return grad(position);
}

vec3 color(vec3 p){
	return  vec3(0.3) + vec3(sin(p.x+p.y)/4.0 +1.0,cos(p.y)/4.0 +1.0, sin(p.z*p.x*0.1)/4.0 +1.0);	
}


const float k = 5.0; // penumbra of shadows
float inShadow(vec3 position, vec3 lightPosition){
	vec3 n = findNormal(position);	
	vec3 toLight = (lightPosition-position);
	vec3 currentPosition = vec3(position)+toLight*HALT*5.0+ n*HALT*5.0;
	
	float res = 1.0;
	
	
	float distanceToLight = length(toLight);
	toLight = normalize(toLight);	
	
	
	float lastDistance = 0.00000001;	
	float signum = sign(findDistance(currentPosition));
	
	for(int i = 1 ; i < ITERATIONS; i++){
		float distance = findDistance(currentPosition);		
		float sig = sign(distance);		
		
		if(length(currentPosition - lightPosition) < distance){
			break;
		}
		
		res = min(res,k*distance/lastDistance);
		
		//if( distance < HALT){
		//	return 0.0;	
		//}
		
		if(sig != signum){
			return 0.0;	
		}
		
		float walk = max(distance, HALT);
		currentPosition = currentPosition + toLight * walk;	
		lastDistance += walk;
		signum = sig;
	}
	
	return max(0.0,res);
}


const float kObscured = 7.0;
float getObscured(vec3 position, vec3 normal){
	float result = 0.0;
	float delta = 0.08;
	for(int i =1 ; i<7; i++){
		vec3 pos = position + normal*(delta*float(i));
		float distance = findDistance(pos);	
		result += (float(i)*delta - distance)/pow(2.0,float(i));
	}
	return max(1.0 - kObscured*result,0.0);
}

float phong(vec3 normal, vec3 toLight){
	return max(0.0,dot(normal,toLight));
}
	
vec3 shadeForLight(vec3 pos, vec3 normal, Light light){
	vec3 result = vec3(1.0);
	float shadow = inShadow(pos,light.pos);
			
	vec3 toLight = light.pos-pos;
	float distToLight = length(toLight);
	toLight = normalize(toLight);
	
	float distForFalloff = max(0.85,distToLight);
	float falloff = 1.0/(distForFalloff*distForFalloff);
	
	float phong1 = phong(normal,toLight);
	vec3 cshadow = pow(vec3(shadow),vec3(1.0,1.2,1.5));
	//return vec3(shadow);
	result = falloff*cshadow*vec3(phong1)*light.color*light.intensity;			
			
	float obscured = getObscured(pos,normal);
	return max(vec3(0.0),result*obscured*color(pos));
}



vec3 shade(vec3 pos, vec3 direction){
	vec3 normal = findNormal(pos);
	vec3 light1 = shadeForLight(pos,normal,light1);
	vec3 light2 = shadeForLight(pos,normal,light2);
	vec3 lightSun = shadeForLight(pos,normal,lightSun);
	return light2+light1+lightSun;
}

vec3 trace(Ray ray, float tMin, float tMax){
	vec3 pos = ray.pos+ray.dir*tMin;
	
	float dist = findDistance(pos);	
	float distanceTravelled = tMin;
	float signum = sign(dist);
	
	for(int i = 1; i < ITERATIONS; i++){
		//if(dist < HALT){
		//	return (pos-ray.dir*HALT);
		//}
		
		float sig = sign(dist);
		if(sig!=signum){
			return pos+ray.dir*dist*1.001;	
		}
		
		if(distanceTravelled > tMax){			
			return ray.pos+ray.dir*tMax;
		}
		float d = max(dist,HALT);
		pos = pos + ray.dir * d;
		dist = findDistance(pos);
		distanceTravelled += d;
		signum = sig;
		
	}
	
	return ray.pos+ray.dir*tMax;
}


void setupLight1(){
	light1.pos = vec3(-3.0+1.0*sin(time*0.3),-1.0+0.2*sin(time*0.5),-5.8-cos(time)*0.3);
	light1.color=vec3(1.0,0.5,0.3);
	light1.intensity = 1.0;
}

void setupLight2(){
	light2.pos = vec3(-1.0+sin(time*0.3),0.0,-2.0+0.8*(sin(time*0.3)));
	light2.color=vec3(0.1,0.5,0.3);
	light2.intensity = 1.3;	
}

void setupLightSun(){
	lightSun.pos = vec3(50.0,-300.0,150);
	lightSun.color=vec3(0.8,0.8,1.0);
	lightSun.intensity = 30000.0;	
}

vec3 spherical(float azimuth, float inclination, float radius){
	float x = radius*sin(inclination)*cos(azimuth);
	float y = radius*sin(inclination)*sin(azimuth);
	float z = radius * cos(inclination);
	return vec3(x,z,y);
}


const float ratio = 0.25;
void main( void ) {

	setupLight1();
	setupLight2();
	setupLightSun();
	
	float inverseWidth = 1.0/resolution.x;
	float inverseHeight = 1.0/resolution.y;
	float fov = 80.0;
	float aspectRatio = resolution.x/resolution.y;
	float angle = tan(PI*0.5*fov/180.0);
	
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 cameraPosition = vec3(0.0);
	vec3 cameraDirection = vec3(0.0);
	
	float xx = (2.0 *((gl_FragCoord.x+0.5) * inverseWidth) -1.0)*angle*aspectRatio;
	float yy = (1.0-2.0*((gl_FragCoord.y+0.5)*inverseHeight))*angle;	
	
	
	vec2 msc = mouse.xy;
	msc.x = (msc.x-0.5)*2.0;
	msc.y = (msc.y-0.5)*2.0;
	
	vec2 scp = (gl_FragCoord.xy - resolution.xy*0.5)/resolution.xy;
	//scp.x = aspectRatio*(position.x*PI+PI*0.5);
	scp.x = (aspectRatio*(scp.x+msc.x))*PI*ratio + PI*1.5;
	scp.y = (scp.y+msc.y*0.5)*PI*ratio+PI*0.5;
	
	vec2 screenp = scp;;

	vec3 sph = spherical(screenp.x,screenp.y,1.0);
	
	//cameraDirection = vec3(xx,yy,-1.0);
	//cameraDirection = normalize(cameraDirection);
	
	Ray ray;
	ray.dir = sph;
	ray.pos = cameraPosition; 

	vec3 hit = trace(ray,0.001,10000.0);
	vec3 color = shade(hit,ray.dir);
	
	gl_FragColor = vec4(color,0.0);
	//gl_FragColor = vec4(screenp,0,0);

}