#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
void sphereFold(inout vec3 z, inout float dr,in float InR2,in float OutR2) {
	float r2 = dot(z,z);
	if (r2<InR2) { 
		// linear inner scaling
		float temp = (OutR2/InR2);
		z *= temp;
		dr*= temp;
	} else if (r2<OutR2) { 
		// this is the actual sphere inversion
		float temp =(OutR2/r2);
		z *= temp;
		dr*= temp;
	}
}
void mengerFold(inout vec3 z, inout float dr)
{
		z = abs(z);
		if (z.x<z.y){ z.xy = z.yx;}
	if(z.x<z.z){z.xz=z.zx;}
	if(z.y<z.z){z.yz=z.zy;}
}
vec4 mulvec4(vec4 a,vec4 b)
{
	vec3  c=a.xyz,d=b.xyz;
	return vec4(a.w*d+b.w*c+cross(c,d),a.w*b.w-dot(c,d));
}
vec3 rotate(in vec3 p,float ang,in vec3 dir)
{
	dir=normalize(dir);
	vec4 rot=vec4(sin(ang*0.5)*dir,cos(ang*0.5));
	vec4 p1=mulvec4(rot,vec4(p,0.0));
	rot.xyz=-rot.xyz;
	p1=mulvec4(p1,rot);
	
//	float s=sin(ang),c=cos(ang);
//	mat2 m=mat2(c,-s,s,c);
	return p1.xyz;
}
	
float DEMenger2D(vec2 p)
{
	float dr=1.0;
	float outr=(cos(time*0.2)+1.0)*0.5;
	float inr=(sin(time*0.8)+1.0)*0.5*outr;
	float Scale=3.0+sin(time*0.01)*.5;
	vec3 z=vec3(p,cos(time*0.01));
	vec3 Offset=vec3(1.0,1.0,1.0);
	for (int n=0;n < 25;n++) {
		sphereFold(z,dr,inr,outr);
		mengerFold(z,dr);
//		z = Scale*z-Offset*(Scale-1.0);
		z=Scale*rotate(z-Offset,time*0.2,vec3(0.0,0.0,1.0))+Offset;
		
		if( z.z<-0.5*Offset.z*(Scale-1.0))  z.z+=Offset.z*(Scale-1.0);
		dr*=Scale;
	}	
	return length(z)/dr;
}
#define EPS 0.03
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*5.0-2.5;
	p.x*=resolution.x/resolution.y;
	
	float color=0.0;
	float de=DEMenger2D(p);
	if(de<EPS){
		float dex=DEMenger2D(vec2(p.x+EPS*0.5,p.y))-de,dey=DEMenger2D(vec2(p.x,p.y+0.5*EPS))-de;
		vec3 norm=normalize(vec3(dex,dey,EPS*0.5));
		vec3 light=normalize(vec3(-0.5,0.5,1.5));
		color=dot(norm,light);
	}	
	
	gl_FragColor = vec4(color,color,color,1.0);

}