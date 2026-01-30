#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float PI = 3.14159265359;

//return 0 to 2*PI for angle: +x -> +y -> -x -> -y -> +x
float atan2(in float y, in float x)
{
  return (atan(-y, -x)+PI);
}

float dSphere(vec3 p, vec4 obj) {
	return length(p - obj.xyz) - obj.a;
}


#define HIT_NOTHING 0
#define HIT_OPAQUE 1
#define HIT_TRANS 2

struct HitInfo {
	int type; //0: nothing, 1: opaque, 2: tanslucent
	vec3 color;
	float dist;
};

HitInfo colorHit(HitInfo hi, float distobj, vec3 colorobj, int typeobj) {
	if (hi.type != HIT_OPAQUE && distobj < hi.dist) {
		HitInfo ret;
		ret.type = typeobj;
		ret.color = colorobj;
		ret.dist = distobj;
		return ret;
	}
	return hi;
}

HitInfo world(vec3 p) {
	HitInfo ret;
	ret.dist = 1e10;
	
	HitInfo hi;
	hi.dist = 1e10;
	
	vec3 pSphere = vec3(0.,0.,-5.+sin(time*.5));
	float rSphere = 1.;
	vec3 cSphere = vec3(.5);
	cSphere.r = 1.-length(p-pSphere);
	hi = colorHit(hi, dSphere(p, vec4(pSphere, rSphere)), cSphere, HIT_OPAQUE);
	if (hi.dist <= 0.) {
		ret = hi;
	}
//*
	float f = 10.;
	//ret.r = (fract(p.x)+fract(p.y))*.05*fract(-p.z);
	ret.color.r += (sin(f*p.x)+sin(f*p.y)+sin(f*p.z))*.1+sin(time)*0.2-0.1;
	ret.type = ret.color.r > 0.001 ? HIT_OPAQUE : HIT_TRANS; //*/
	
	return ret;
}

void main( void ) {
	float aspectRatio = resolution.x / resolution.y;
	vec2 sp = (gl_FragCoord.xy / resolution.xy) * 2. - 1.; // 0,0 at center of screen
	sp.x *= aspectRatio;
	vec2 p2 = surfacePosition; // 0,0 at center of screen
	p2.x *= aspectRatio;
	vec2 mp = mouse.xy * 2. - 1.; // 0,0 at center of screen
	mp.x *= aspectRatio;
	
	
	vec3 color = vec3(0.);
	//color3 = vec3(p.x,p.y,0);
	//color3 = vec3(sin(length(p)*100.));
	float r = length(p2);
	float a = atan2(p2.y,p2.x);
	
	float tr = sin(time)*10.;
	float ta = sin(time*2.)*10.;
	
	const float n = 8.; //outer/pizza loop count
	const float a1 = 2.*PI/n;
	
	const float depthMax = 10.; //back/far plane
	const float depthIter = 128.;
	const float nn = depthIter/n; //inner/depth loop count
	const float d1 = depthMax/depthIter; 
	const float depthMin = 2.; //front/near plane is 2 deep (-2) (gives 90 fov)
	vec3 ray = (vec3(sp,-depthMin)); //ray for current pixel. // 0,0 at center of screen
	vec3 origin = vec3(sp,-depthMin);
	vec3 p3 = origin + ray + vec3(mp,0.);
	
	float d = 0.;
	float iLast = 0.;
	bool hitNonTransparent = false;
	HitInfo hi;
	for (float i=0.; i<n; i+=1.) {
		if (a>i*a1) { //see result after i iterations as a pizza slice
			iLast = i;
			for (float _=0.; _<nn; _++) {
				if (!hitNonTransparent) {
					d += d1;
					p3 += ray*d1;
					hi = world(p3);
					color += hi.color;
					if (hi.type == HIT_OPAQUE) { hitNonTransparent=true; }
				}
			}
		}
	}
	//debug
	//color3 += vec3(0,a/2./PI,0);
	float noHitPizzaBackground = hi.type == HIT_OPAQUE ? 0. : iLast*1./n;
	gl_FragColor = vec4(color + vec3(0.,0.,noHitPizzaBackground), 1.);

}