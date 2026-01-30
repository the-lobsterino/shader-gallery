//--- chamber
// by Catzpaw 2018
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define OCT 5
#define ITER 128
#define EPS .005
#define NEAR 0.
#define FAR 30.

vec3 rotX(vec3 p,float a){return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a));}
vec3 rotY(vec3 p,float a){return vec3(p.x*cos(a)-p.z*sin(a),p.y,p.x*sin(a)+p.z*cos(a));}
vec3 rotZ(vec3 p,float a){return vec3(p.x*cos(a)-p.y*sin(a), p.x*sin(a)+p.y*cos(a), p.z);}
vec3 hsv(float h,float s,float v){return ((clamp(abs(fract(h+vec3(0.,.666,.333))*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}
float box(vec3 p){return length(max(abs(p)-1.5,0.0));}

float map(vec3 p){
	float s=.99,df=.6;
	p=rotX(p,time*.17);p=rotY(p,time*.13);
	for(int i=0;i<OCT;i++){
		if(p.x>1.){p.x=2.-p.x;}else if(p.x<-1.){p.x=-2.-p.x;}
		if(p.y>1.){p.y=2.-p.y;}else if(p.y<-1.){p.y=-2.-p.y;}
		if(p.z>1.){p.z=2.-p.z;}else if(p.z<-1.){p.z=-2.-p.z;}
		float q=p.x*p.x+p.y*p.y+p.z*p.z;
		if(q>.25){p*=4.;df*=4.;}else if(q<1.){p*=1./q;df*=1./q;}
		p*=s;p+=.0;df*=s;		
	}
	return (box(p))/df;
}

float trace(vec3 ro,vec3 rd,out float n){float t=NEAR,d;
					 n=0.;
	for(int i=0;i<ITER;i++){d=map(ro+rd*t);if(abs(d)<EPS||t>FAR)break;t+=step(d,1.)*d*.2+d*.5;n+=1.;}
	return min(t,FAR);}

void main(void){
	vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	float n=0.,v=trace(vec3(sin(time)*.003,sin(time*.8)*.01,clamp(sin(time*.3)*15.,0.,.82)-.85),vec3(uv,.5),n)*.3;n/=float(ITER);
	gl_FragColor=vec4(mix(hsv(v+time*.05,.5,n),vec3(1),v),1);
}
