#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define EPS 0.0001
//http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}
float sdTorus( vec3 p, vec2 t )
{
  	
	vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}
float ellipsoid(vec3 p,vec3 a,vec3 b,float r)
{
	return length(p-a)+length(p-b)-length(a-b)-2.0*r;	
}
#define edge 0.129
#define root3 0.86602540378443864676372317075294
#define pi1_6 0.52359877559829887307710723054658
#define pi1_3 1.0471975511965977461542144610932
float DeSix(vec2 p)
{
	vec2 uv=p;
	uv.x=mod(p.x,1.5*edge)-.75*edge;
	uv.y=mod(p.y,2.0*root3*edge)-root3*edge;
	float ang=atan(uv.y,uv.x);
	float len=length(uv)*cos(pi1_6-mod(ang,pi1_3));
	if(len>0.5*root3*edge){
		float n=floor(ang/pi1_3);
		ang=n*pi1_3+pi1_6;
		vec2 o=root3*edge*vec2(cos(ang),sin(ang));
		uv-=o;
		ang=atan(uv.y,uv.x);
		len=length(uv)*cos(pi1_6-mod(ang,pi1_3));
	}
	return abs(root3*0.5*edge-len);
}
#define Torus vec2(0.5,0.25)
float De(vec3 p)
{
//	float de1=udRoundBox(p,vec3(0.5,0.2,0.3),0.01);
	float de2=sdTorus(p,Torus);
//	float de3=ellipsoid(p,vec3(0.0,0.3,0.0),vec3(0.0,-0.3,0.0),0.1);
//	return max(min(de2,de1),-de3);		
	return de2;
}
float tr(vec3 p,out vec3 target,vec3 dir)
{
	float td=0.0;
	for(int i=0;i<80;i++){
		float de=sdTorus(p,Torus);
		td+=de;
		p+=de*dir;
		if(de<EPS){
			target=p;
			return td;
		}
	}
	return -100.0;
}
vec2 mapcoord(vec3 p)
{
	vec2 t=Torus;	
	float cosa=(dot(t,t)-dot(p,p))*0.5/t.x/t.y;
	float ang_r=acos(cosa);
	if(p.z<0.0)ang_r=8.*atan(1.0)-ang_r;
	float ang_R=atan(p.z,p.x);
	return vec2(t.x*ang_R,t.y*ang_r);
}	
vec3 GetNormal(vec3 p)
{
//	float ang=atan(p.y,p.x);
//	vec3 o=vec3(Torus_R*cos(ang),Torus_R*sin(ang),0.0);
//	return (p-o)/Torus_r;
	float de=De(p);
	return normalize(vec3(De(vec3(p.x+EPS*0.5,p.y,p.z))-de,De(vec3(p.x,p.y+EPS*0.5,p.z))-de,EPS*0.5));
}	
float TR(vec3 p,out vec3 target,vec3 dir)
{
	float de1=tr(p,target,dir),de=0.0;
	if(de1>0.0){
 		vec2 uv=mapcoord(target);
		de=DeSix(uv);
		if(de<0.01){return de;}
		else {
			p=target+2.0*EPS*dir;
			de1=tr(p,target,dir);
			if(de1>0.0){
				vec2 uv=mapcoord(target);
				de=DeSix(uv);
				if(de<0.01){return de;}
			}
		}
		return -10.0;
	}
	return -100.0;
}


vec4 cross4(vec4 a,vec4 b)
{
	return vec4(cross(a.xyz,b.xyz)+a.w*b.xyz+b.w*a.xyz,a.w*b.w-dot(a,b));
}
vec3 Rotate(vec3 p,float ang,vec3 axis)
{
	axis=normalize(axis);
	vec4 a=vec4(p,0.0);
	vec4 rot=vec4(sin(ang*0.5)*axis,cos(ang*.5));
	vec4 res=cross4(rot,a);
	rot.xyz=-rot.xyz;
	res=cross4(res,rot);
	return res.xyz;
}


void main( void ) {

   	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	float color = 0.0,bkcolor=0.0;
	vec3 p=vec3(pos,1.0),target,norm,eyepos=vec3(0.0,0.0,5.0);
	vec3 rotaxis=normalize(vec3(mouse-0.5,0.5));
	p=Rotate(p,time*0.1,rotaxis);
	eyepos=Rotate(eyepos,time*0.1,rotaxis);
	vec3 dir=normalize(p-eyepos);
	vec3 light=normalize(vec3(1.0,1.0,3.0));
	light=Rotate(light,time*0.1,rotaxis);
	float td=tr(p,target,dir);
	vec3 rgb=vec3(0.8,0.5,0.4);
	if(td>0.0){
		norm =GetNormal(target);
		color=dot(norm,light);
		color+=pow(color,64.0);		
		vec2 uv=mapcoord(target);
		float de=DeSix(uv);
		if(de<0.01){
			td=smoothstep(0.01,0.0,de);
			gl_FragColor=vec4(color*rgb*td,1.0);
		}
		else gl_FragColor=vec4(color*vec3(1.0,0.0,1.0),1.0);
	}
	else gl_FragColor=vec4(0.0);
}