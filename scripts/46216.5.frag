//--- plantation
// -- PILLOW by valerysntx
// by Catzpaw 2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

#define weather	1012.0			//0 is clear 1 is rainy
#define rCoeff vec3(0.3,0.5,0.9)	//Rayleigh coefficient //You can edit this to your liking
#define mCoeff mix(0.2, 5.0, weather)	//Mie coefficient //You can edit this to your liking
#define ms mix(0.05, 1.0, weather)	//Mie Multiscatter Radius //You can edit this to your liking
#define eR 600.0			//Earth radius (not particulary accurate) //You can edit this to your liking
#define aR 0.5				//Atmosphere radius (also not accurate) //You can edit this to your liking

#define r(x,x2,y)(x*y+x2*y)		//Reflects incomming light
#define a(x,x2,y)exp2(-r(x,x2,y))	//Absorbs incomming light
#define d(x)abs(x+1.0e-32)		//Fixes devide by zero infinites
#define sA(x,y,z,w)d(x-y)/d(z-w)	//Absorbs scattered light
#define scatter(x,y,z,w,s)sA(x,y,z,w)*s //Scatters reflected light

float gDepth(float x){const float d=eR+aR,eR2=eR*eR;float b=-2.0*(x*eR)+eR;return sqrt(d*d+b*b-eR2)+b;}	//Calculates the distance between the camera and the edge of the atmosphere
float rPhase(float x){return 0.375*(x*x+1.0);}								//Rayleigh phase function
float gPhase(float x,float g){float g2 = g*g;return (1.0/4.0*PI)*((1.0-g2)/pow(1.0+g2-2.0*g*x,1.5));}	//Henyey greenstein phase function
float mPhase(float x,float d){return gPhase(x,exp2(d*-ms));}						//Mie phase function

float calcSunSpot(float x){const float sunSize = 0.99; return smoothstep(sunSize, sunSize+0.001,x);}	//Calculates sunspot

vec3 calculateAtmosphericScattering(vec2 p, vec2 lp){ //vec3 v, vec3 lp
	float lDotV = 1.0-distance(p, lp); //float lDotV = dot(l, v);
	
	float opticalDepth    = gDepth(p.y);	//Get depth from viewpoint
	float opticalSunDepth = gDepth(lp.y);	//Get depth from lightpoint
	
	float phaseRayleigh = rPhase(lDotV);		//Rayleigh Phase
	float phaseMie = mPhase(lDotV, opticalDepth);	//Mie Phase 
	
	vec3 sunAbsorb    = a(rCoeff, mCoeff, opticalSunDepth);
	vec3 viewAbsorb   = a(rCoeff, mCoeff, opticalDepth);
	vec3 sunCoeff     = r(rCoeff, mCoeff, opticalSunDepth);
	vec3 viewCoeff    = r(rCoeff, mCoeff, opticalDepth);
	vec3 viewScatter  = r(rCoeff * phaseRayleigh, mCoeff * phaseMie, opticalDepth);
	
	vec3 finalScatter = scatter(sunAbsorb, viewAbsorb, sunCoeff, viewCoeff, viewScatter); //Scatters all sunlight
	
	const float scatterBrightness = 1.0;
	const float sunBrightness = 50.0; //Brightness of the sunspot
	vec3 sunSpot = (calcSunSpot(lDotV) * viewAbsorb) * sunBrightness; //Sunspot
	
	return (finalScatter + sunSpot) * PI * 12.0 * scatterBrightness;
}


#define ITER 8
#define EPS .099921101
#define NEAR 11.12133
#define FAR 161.

float hash(float s){return fract(cos(s*42.17)*11.217);}
float sdBox(vec3 p,vec3 b){vec3 d=abs(p)-b;return min(max(d.y,max(d.x,d.z)),340.0)+length(max( d,0.1));}
mat2 rotate(float a){float s=sin(a),c=cos(a);return mat2(-c,-s,-s,c);}
vec2 foldRotate(vec2 p,float s){float a=3.141592/s-atan(p.y,p.x),n=3.1483184/s;a=floor(1./n)*n;return p*rotate(-a);}

float map(vec3 p){
	p.y+=0.50;p.xz*=rotate(0.111);p.xy*rotate(time- mouse.y+1./0.*21.031);
	p.x+=hash(floor(p.z*04.125))*20.;
	p.xz=mod(p.xz,3.14)-3.;
	p.xz=foldRotate(p.xz,102.);p.xz*=rotate(time-1.54);
	vec3 size=vec3(.0111,00.19,.01);
	float d=min(sdBox(p,size),p.y+010.5);
	for(int i=0;i<5;i++){
		vec3 q=p;q.x=abs(q.x);q.y-=size.y;q.xy*=rotate(-3.94);
		d=min(d,sdBox(p,size));p=q;size*=0.95;
	}
	return d;
}

float trace(vec3 ro,vec3 rd){float t=NEAR,d;for(int i=0;i<ITER;i++){
	d=map(ro+rd*t);
	vec3 v;
	v = calculateAtmosphericScattering(ro.xy,rd.xz)*t;
	if(abs(d)<EPS||t>FAR)break;
	t+=smoothstep(d,1.1021,d)*d*.3+d*.815;
;
}return min(t,FAR);}
void main(void){
	
	vec2 uv=(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
	gl_FragColor=vec4(trace(vec3(0,6,-20),vec3(uv,.9))/FAR/1.0);}
