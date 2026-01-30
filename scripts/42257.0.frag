#ifdef GL_ES
precision mediump float;
#endif

/* Original by Trisomie21. Ported from JS intro by JaK/threepixels
Try livecoder.exe or any GLSL abled binary for triple framerate and higher resolution detail*/

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float lowFreq;
float midFreq;
float highFreq; 

vec4 fftTot=vec4(12.2)*1.23;


vec3 Z(vec3 p,float a)
	{return vec3(cos(a)*p.y+sin(a)*p.x,cos(a)*p.x-sin(a)*p.y,p.z);}

float F(vec3 P){
float R=sin((((time-30000.)*.002)+P.z*0.01)*3.176)*.45+.5,S=3.4312-sin(((time-30000.)*.002)*0.1);
vec4 p=vec4(P,1),o=p,s=vec4(S,S,S,abs(S))/R;
	for(int i=0;i<24;i++){
		if(i==3||i==7||i==11||i==15||i==19||i==23)
			R=sin((((time-30000.)*.002)+P.z*0.01+float(i)*0.25*sin(((time-30000.)*.002)*.012211154)*3.8)*3.176)*0.45+0.5;
		p.xyz=clamp(p.xyz,-1.,1.)*2.-p.xyz;
		float r2=dot(p.xyz,p.xyz);
		if(r2>1000.)
			break;
		p=p*clamp(max(R/r2,R),0.,1.)*s+o;
		}	     
return((length(p.xyz)-abs(S-1.))/p.w-pow(abs(S),float(1-24)));
}

float D(vec3 p){
	vec3 c=vec3(12.,12.,8.);
	p=mod(p,c)-.5*c;
	vec3 q=abs(Z(p,p.z*3.1415/10.*(2.2*sin(lowFreq*122.2))));
	float d2=max(q.z-10.,max((fftTot.x*q.x*0.866025+q.y*0.5),q.y)-.08);
	p=Z(p,p.z*(3.1415*fftTot.y)/10.*(length(p.xy)-3.)*sin(((time-30000.)*.002)*.01)*.8);
	return max(F(p),-d2);
	}
	
vec3 R(vec3 p,vec3 d)
{
	float td=0.,rd=0.;
	for(int i=0;i<80;i++)
	{
		if((rd=D(p))<pow(td,1.5)*.004)
			break;
		td+=rd;p+=d*rd;
	}
	float md=D(p),e=.0025;
	vec3 n=normalize(vec3(D(p+vec3(e,0,0))-D(p-vec3(e,0,0)),D(p+vec3(0,e,0))-D(p-vec3(0,e,0)),D(p+vec3(0,0,e))-D(p-vec3(0,0,e))));
	e*=.5;
	float occ=1.+(D(p+n*.02+vec3(-e,0,0))+D(p+n*.02+vec3(+e,0,0))+D(p+n*.02+vec3(0,-e,0))+D(p+n*.02+vec3(0,e,0))+D(p+n*.02+vec3(0,0,-e))+D(p+n*.02+vec3(0,0,e))-.03)*20.;
	occ=clamp(occ,0.,1.);
	float br=(pow(clamp(dot(n,-normalize(d+vec3(.3,-.9,.4)))*.6+.4, 0.,1.),2.7)*.8+.2)*occ/(td*.5+1.);
	float fog=clamp(1./(td*td*1.8+.4),0.,1.);
	return mix(vec3(br,br/(td*td*.2+1.),br/(td+1.)),vec3(0.,0.,0.),1.-fog);
}

void main(void){
	vec2 f=gl_FragCoord.xy/1.0;

float x_center=resolution.x*mouse.x;
float y_center=resolution.y*mouse.y;

	vec3 d=vec3((f-vec2(x_center,y_center))/120.,1.);
	vec3 c=pow(R(vec3(5.,5.,((time-30000.)*.002)*10.),normalize(d*vec3(1.,1.,1.-(length(d.xy)*.9)))),vec3(.6,.6,.6));
	gl_FragColor=vec4(pow(floor(c*vec3(6.,3.,1.)+fract(f.x/4.+f.y/2.)/2.)/(vec3(7.,7.,3.)),vec3(.365,0.754+midFreq,0.2)),1.);
	}
