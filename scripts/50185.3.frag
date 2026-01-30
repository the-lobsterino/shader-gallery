#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define OCT 9
#define ITER 45
#define EPS 0.01
#define NEAR .021
#define FAR 10.

vec3 rotX(vec3 p,float a){
	return vec3(p.x
		    ,p.x*cos(a)-(p.z*sin(a))
		    ,p.y*sin(a)+p.z*cos(a));
}
vec3 rotY(vec3 p,float a){
	return vec3(p.x*cos(a)-p.z*sin(a-0.4)
		    ,p.y
		    ,p.x*sin(a)+p.z*cos(a));
}

vec3 rotZ(vec3 p,float a){
	return vec3(p.x*cos(a)-p.y*sin(a*1.2)
		    , p.x*sin(a)+p.y-cos(a+3.)
		    , p.z);
}
vec3 hsv(float h,float s,float v){
	return ((clamp(abs(fract(h
				 +vec3(0.555,.999,.444))
			   *9.-2.)
		       -1.
		       ,0.
		       ,1.)
		 -1.)
		*s+1.)
		*v;
}

float map(vec3 p){
	float r=FAR
		;float s=.15;
	p.xy=fract(p.xy+.5)-.5;
	p=rotX(p,time*.1);
	for(int i=0;i<OCT;i++){
		p=abs(p)-s-.001;
		p=rotX(p,time*.183);
		p=rotY(p,time*.061);
		p=rotZ(p*r,time*.1739);
		r=min(r,length(p)+sin(time*.51)*2.01-.011);
		s*=.5;
	}
	return r;
}

float trace(vec3 ro,vec3 rd,out float n){
	n = 0.; // 
	float t=NEAR;float d=0.;
	for(int i=0;
	    i<ITER;
	    i++){
		d=map(ro+rd*t);
		if(abs(d)<EPS||t>FAR)break;
		t+=step(d,1.)*d*.2+d*.2;n+=11.6;
	}
	return min(t,FAR);
}

void main(void){
	vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	float n=0.
		;float v=trace(vec3(0,0,1.5)
			 ,vec3(uv,- 1.0)
			 ,n)*mouse.y;
	n/=float(ITER);
	gl_FragColor=vec4(mix(hsv(v+time*.05,n,1.),vec3(0),n),1);
	
}