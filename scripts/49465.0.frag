#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define EPS 0.000001
#define Torus_r 0.4
#define Torus_R 0.6
#define Gap  0.15
vec2 Torus=vec2(Torus_R,Torus_r);

float GetColor(vec3 p)
{
	float ang_R=atan(p.y,p.x);
	float da_r=Gap/Torus_r,da_R=Gap/Torus_R;
	vec3 p0=vec3(Torus_R*cos(ang_R),Torus_R*sin(ang_R),0.0);

	float cosa=(Torus_R*Torus_R+dot(p-p0,p-p0)-dot(p,p))/(2.0*Torus_R*length(p-p0));
	float ang_r=acos(cosa); 
	if(p.z<0.0)ang_r=8.*atan(1.0)-ang_r;
	ang_r+=time;	
	
	
	float fda_r=1.0-abs(2.0*mod(ang_r,da_r)/da_r-1.0),fda_R=1.0-abs(2.0*mod(ang_R,da_R)/da_R-1.0);
	return 1.0-pow((fda_r*fda_r+fda_R*fda_R),.50);
}

float De(vec3 p,vec2 t)
{
	return  length (vec2(length(p.xy)-t.x,p.z))-t.y-0.1*GetColor(p);
}

float TR(vec3 p,out vec3 target,vec3 dir)
{
	float td=0.0;
	for(int i=0;i<80;i++){
		float de=De(p,Torus);
		td+=de;
		p+=de*dir;
		if(de<EPS){target=p;return td;}
	}
	return 0.0;
}


vec3 GetNormal(vec3 p)
{
//	float ang=atan(p.y,p.x);
//	vec3 o=vec3(Torus_R*cos(ang),Torus_R*sin(ang),0.0);
//	return (p-o)/Torus_r;
	vec2 t=Torus;
	float de=De(p,t);
	return normalize(vec3(De(vec3(p.x+EPS*0.5,p.y,p.z),t)-de,De(vec3(p.x,p.y+EPS*0.5,p.z),t)-de,EPS*0.5));
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

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*2.0-1.0 ;
	position.x*=resolution.x/resolution.y;
	float color = 0.0,bkcolor=0.0;
	vec3 p=vec3(position,1.5),target,norm,eyepos=vec3(0.0,0.0,5.0);
	vec3 rotaxis=normalize(vec3(mouse-0.5,0.5));
	p=Rotate(p,time*0.1,rotaxis);
	eyepos=Rotate(eyepos,time*0.1,rotaxis);
	vec3 dir=normalize(p-eyepos);
	vec3 light=normalize(vec3(1.0,1.0,3.0));
	light=Rotate(light,time*0.1,rotaxis);
	float td=TR(p,target,dir);
	if(td>0.0){
		color=GetColor(target);
		norm =GetNormal(target);
		bkcolor=0.5*dot(norm,light);
	}
	
//	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
//	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
//	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
//	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( color+bkcolor,color+bkcolor,bkcolor, 5.0 );

}