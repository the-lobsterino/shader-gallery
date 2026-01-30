//--- sugar
// by Catzpaw 2019
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITER 48
#define EPS 0.01
#define NEAR 0.5
#define FAR 8.0

vec3 rotX(vec3 p,float a){return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a));}
vec3 rotY(vec3 p,float a){return vec3(p.x*cos(a)-p.z*sin(a),p.y,p.x*sin(a)+p.z*cos(a));}
vec3 hsv(float h,float s,float v){return ((clamp(abs(fract(h+vec3(0.,.666,.333))*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}
float hash(float v){return fract(sin(v*511.1)*1333.3);}
float displacement(vec3 p){p=floor(p);return hash(p.x+p.y*10.+p.z*100.);}
float sdTorus(vec3 p){vec2 q=vec2(length(p.xy)-.2,p.z);return length(q)-.1;}
float sdRoundBox(vec3 p){vec3 d=abs(p)-.15;return length(max(d,0.))-.02;}
float sdGround(vec3 p){return p.y+.2;}

float map(vec3 p){p=rotX(p,.8);p=rotY(p,-time*.4);float h=hash(floor(p.x)+floor(p.z)*133.3),o=0.;
	vec3 q=fract(p)-.5;q.y=p.y;q=rotX(q,time);q=rotY(q,time*2.+h);o=h<.5?sdTorus(q):sdRoundBox(q);
	return min(sdGround(p)+displacement(p*300.)*.01,o+displacement(q*100.)*.01);}

float trace(vec3 ro,vec3 rd,out float c,out vec3 p){float t=NEAR,d;
	for(int i=0;i<ITER;i++){p=ro+rd*t;d=map(p);if(abs(d)<EPS||t>FAR)break;t+=step(d,2.)*d*.5+d*.1;c+=1.;}
	return min(t,FAR);}

void main(void){
	vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;vec3 r,n;
	float c=0.,v=trace(vec3(sin(time)*.003,sin(time*.8)*.01,sin(time*.3)*.5-1.),vec3(uv,.6),c,r)*.3;c/=float(ITER);
	n=normalize(cross(dFdx(r),dFdy(r)));float s=pow(clamp(dot(n,vec3(0.,0.,1.)),0.,1.),80.);
	gl_FragColor=vec4(mix(vec3(1),hsv(v*.2+time*.05,.3,c*v),c)+s,1);
}