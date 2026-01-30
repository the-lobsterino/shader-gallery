#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int maxIter = 100;
const float lMin = 0.001;

int nReflections = 1;
int nDiffuses = 1;

vec3 COLSUN = vec3(1.0,1.0,1.0);
vec3 COLHorizon = vec3(0.0,0.2,0.4);
float RSUN = 0.1;
float R1 = 1.0;
float R2 = .5;
float RHorizon = 100.0;
float RCam = 4.0;
vec3 POSSUN = vec3(0.0,0.0,-2.0);
vec3 POS1 = vec3(-1.0,0.0,0.0);
vec3 POS2 = vec3(1.0,0.0,0.0);
float SCALE = 3.0;
float nPHONG = 80.0;
float PI = 3.14;


vec3 Ia = vec3(0.8,0.2,0.2);	// ambient Intensity
vec3 Is1 = vec3(0.2,0.2,0.8); 	// sunlight Intensity
vec3 Is2 = vec3(0.2,0.8,0.2); 	// sunlight Intensity
float ka = .5;				// ambient
float kd = .5;				// diffuse
float ks = .5;				// specular

vec3 BackGround(vec3 dir){
	dir = normalize(dir);
	float phi = atan(dir.y/length(dir.xz));
	float theta = atan(dir.x/dir.z);
	float x = 0.25*(sin(phi*100.0)+sin(theta*100.0))+.5;
	vec3 karo;
	if (dir.y<-0.2) {
		karo = vec3(x,0,0);
	} else {
		karo = vec3(0,x*0.5,x);
	}
	return cos(phi)*vec3(.6,.8,1.0)+karo*0.5;
}
vec3 getIs(int obj){
	if (obj == 1){
		return Is1;
	}else if (obj==2){
		return Is2;
	}
	return vec3(0.0,0.0,0.0);
}
float norm(vec3 v){
	return sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
}
float distEstim(out int obj, int obj0, vec3 pos){
	float d1 = norm(pos-POS1)-R1;
	float d2 = norm(pos-POS2)-R2;
	float dS = norm(pos-POSSUN)-RSUN;
	float dH = -(norm(pos)-RHorizon);
	if (d1<d2 && d1<dS && d1<dH && obj0!=1){
		obj = 1;
		return d1;
	}else if (d2<dS&&d2<dH && obj0!=2){
		obj = 2;
		return d2;
	}else if (dS<dH && obj0!=0){
		obj=0;
		return dS;
	}
	else {
		obj=-1;
		return dH;
	}
}

vec3 getnorm(int obj, vec3 pos){
if (obj==1)
	return normalize(pos-POS1);
else if (obj == 2)
	return normalize(pos-POS2);
else if (obj == 0)
	return normalize(pos-POSSUN);
else
	return normalize(-pos);
}

void traceray(vec3 dir, out vec3 pos, out float dist, out vec3 norm, out int obj){
	int obj0 = obj;
	dist = 0.0;
	norm = vec3(0.0,0.0,0.0);
	int reflections = 0;
	for (int iter = 0; iter<maxIter; iter++){
		float l = distEstim(obj,obj0,pos);
		pos+=dir*l;
		dist+=l;
		if (l<lMin){
			norm = getnorm(obj,pos);
			break;
		}
	}
}
float sprod(vec3 a, vec3 b){
	return a.x*b.x + a.y*b.y + a.z*b.z;
}
vec3 reflection(vec3 Nv,vec3 Lv){ return normalize(2.0*Nv*sprod(Lv,Nv)-Lv);}
vec4 OBJcol(vec3 Lv, vec3 Vv, vec3 Nv,int obj){
	vec3 Rv = reflection(Nv,Lv);
	vec3 Is = getIs(obj);
	

		
	vec3 Iambient = Ia* ka;
	vec3 Idiffuse = Is* kd * sprod(Lv,Nv);
	vec3 Ispec = Is* ks * (nPHONG+2.0)/(2.0*PI)*pow(max(0.0,sprod(Rv,Vv)),nPHONG);
	return vec4(Iambient+Idiffuse+Ispec,1.0);
}

vec4 raytracing(vec3 dir, vec3 pos, int obj, int iReflection){
	vec4 color = vec4(0.0,0.0,0.0,0.0);	
	float dist = 0.0;
	vec3 norm = vec3(0.0,0.0,0.0);

	traceray(dir, pos, dist, norm,obj);
	if (obj==-1){ return vec4(BackGround(pos),1.0);}
	if (obj==0) { return vec4(COLSUN,1.0);}
	if (iReflection == nReflections || obj==1){
		vec3 Lv = normalize(POSSUN-pos);
		return OBJcol(Lv,-dir,norm,obj);
	}
	dir = reflection(norm,-dir);
//	color = raytracing(vec3(1.0,1.0,1.0),vec3(1.0,1.0,1.0),1,1);	
	return color;
}
mat3 rotmat(float angx, float angy){
	return mat3(cos(angy),0,sin(angy),
		    0,       1, 0,
		   -sin(angy),0,cos(angy))*
	mat3(1,0,0, 0,cos(angx),-sin(angx), 0,sin(angx),cos(angx));
}

float applyscale(float x,float a,float b,float v){return x*(b-a)+a;}
void main( void ) {
	float roty = applyscale(mouse.y,0.1,PI/4.0,1.0);
	float rotx = applyscale(mouse.x,0.5,-PI,1.0);
	
	mat3 rot = rotmat(roty,rotx);
	vec3 position = rot*vec3((( (gl_FragCoord.xy-resolution.xy/2.0) / resolution.y ))*SCALE,0.0);
	vec3 camera = rot*vec3(0.0,0.0,RCam);
	
	vec3 pos = camera;
	vec3 dir = normalize(position-camera);
	gl_FragColor = raytracing(dir,pos,-1,0);
	
}