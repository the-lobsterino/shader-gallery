#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 cmul(vec2 a,vec2 b)
{
	return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);
}
void cmul(in vec3 p,in vec2 t, out vec3 ret[2])
{
	ret[0]=t.x*p;
	ret[1]=t.y*p;	
}

void cmul(in vec3 re1,in vec3 im1, in vec3 re2,in vec3 im2,out vec3 re,out vec3 im)
{
	vec2 x=cmul(vec2(re1.x,im1.x),vec2(re2.x,im2.x));
	vec2 y=cmul(vec2(re1.y,im1.y),vec2(re2.y,im2.y));
	vec2 z=cmul(vec2(re1.z,im1.z),vec2(re2.z,im2.z));
	re=vec3(x.x,y.x,z.x);
	im=vec3(x.y,y.y,z.y);
}
vec2 cdot(in vec3 re1,in vec3 im1,in vec3 re2,in vec3 im2)
{
	vec2 x=cmul(vec2(re1.x,im1.x),vec2(re2.x,im2.x));
	vec2 y=cmul(vec2(re1.y,im1.y),vec2(re2.y,im2.y));
	vec2 z=cmul(vec2(re1.z,im1.z),vec2(re2.z,im2.z));
	return x+y+z;	
}
vec2 cdiv(vec2 a,vec2 b)
{
	vec2 c=vec2(b.x,-b.y);
	return cmul(a,c)/dot(b,b);	
}


vec2 distFunc(vec3 posr,vec3 posi)
{
	vec3 a,b;
	cmul(posr,posi,posr,posi,a,b);
	a-=0.6;
	vec2 ret=cdot(a,b,a,b);
	ret.x-=3.0*0.6*0.6-0.7*0.7;
	return ret;	
//	dot(p*p-r,p*p-r)-3.0*r*r+R*R;
}	
float distFunc(vec3 p)
{
	
	return distFunc(p,vec3(0)).x;
}
vec2 dFunc(vec3 pr,vec3 pi,vec3 dir)
{
	vec2 eps=vec2(0.001,0.001);
	vec3 dp[2];
	cmul(dir,eps,dp);	
	return cdiv(distFunc(pr+dp[0],pi+dp[1])-distFunc(pr,pi),eps);
}
float QuadricRoot(vec3 p,vec3 dir,out vec2 ret[4])
{
	vec2 t=vec2(0.5,0.2),t1,t2,t3,t4;
	vec2 dt;
	vec3 q[2];
	float rootn=0.0;
	cmul(dir,t,q);
	q[0]+=p;
	for(int i=0;i<12;i++){
		dt=-cdiv(distFunc(q[0],q[1]),dFunc(q[0],q[1],dir));
		t+=dt;
		vec3 dq[2];
		cmul(dir,dt,dq);
		q[0]+=dq[0];
		q[1]+=dq[1];
		if(length(dt)<1.e-10)break;
	}
	t1=t;
	if(abs(t.y)<0.001)rootn+=1.0;
	t=vec2(.5,0.2);
	cmul(dir,t,q);
	q[0]+=p;
	for(int i=0;i<12;i++){
		vec2 f=cdiv(distFunc(q[0],q[1]),t-t1);
		vec2 df=cdiv(dFunc(q[0],q[1],dir),t-t1)-cdiv(f,t-t1);
		dt=-cdiv(f,df);
		t+=dt;
		vec3 dq[2];
		cmul(dir,dt,dq);
		q[0]+=dq[0];
		q[1]+=dq[1];
		if(length(dt)<1.0e-10)break;
	}
//	if(abs(dt)>0.01)return 1.0;
	t2=t;
	if(abs(t.y)<0.001)rootn+=1.0;
	t=vec2(0.2,.5);
	cmul(dir,t,q);
	q[0]+=p;
	for(int i=0;i<10;i++){
		vec2 f=cdiv(cdiv(distFunc(q[0],q[1]),t-t1),t-t2);
		vec2 df=cdiv(cdiv(dFunc(q[0],q[1],dir),t-t1),t-t2)-cdiv(f,t-t1)-cdiv(f,t-t2);
		dt=-cdiv(f,df);
		t+=dt;
		vec3 dq[2];
		cmul(dir,dt,dq);
		q[0]+=dq[0];
		q[1]+=dq[1];
		if(length(dt.x)<1.0e-10)break;
	}
	t3=t;
	if(abs(t.y)<0.001)rootn+=1.0;	
	t=vec2(0.2,.5);	
	cmul(dir,t,q);
	q[0]+=p;
	for(int i=0;i<10;i++){
		vec2 f=cdiv(cdiv(cdiv(distFunc(q[0],q[1]),t-t1),t-t2),t-t3);
		vec2 df=cdiv(cdiv(cdiv(dFunc(q[0],q[1],dir),t-t1),t-t2),t-t3)-cdiv(f,t-t1)-cdiv(f,t-t2)-cdiv(f,t-t3);
		dt=-f/df;
		t+=dt;
		vec3 dq[2];
		cmul(dir,dt,dq);
		q[0]+=dq[0];
		q[1]+=dq[1];
		if(length(dt)<1.0e-10)break;
	}
	t4=t;
	if(abs(t.y)<0.001)rootn+=1.0;
	ret[0]=t1;
	ret[1]=t2;
	ret[2]=t3;
	ret[3]=t4;
	return rootn;
}



float deteminant(mat3 m)
{	
return m[0].x*m[1].y*m[2].z+m[0].y*m[1].z*m[2].x+m[0].z*m[1].x*m[2].y-m[0].x*m[1].z*m[2].y-m[0].y*m[1].x*m[2].z-m[0].z*m[1].y*m[2].x;
}
float determinant(mat4 m)
{
	mat3 m1,m2,m3,m4;
	m1[0]=vec3(m[1]);
	m1[1]=vec3(m[2]);
	m1[2]=vec3(m[3]);
	m2[0]=vec3(m[0]);
	m2[1]=vec3(m[2]);
	m2[2]=vec3(m[3]);
	m3[0]=vec3(m[0]);
	m3[1]=vec3(m[1]);
	m3[2]=vec3(m[3]);
	m4[0]=vec3(m[0]);
	m4[1]=vec3(m[1]);
	m4[2]=vec3(m[2]);
	return -m[0].w*deteminant(m1)+m[1].w*deteminant(m2)-m[2].w*deteminant(m3)+m[3].w*deteminant(m4);	
}


vec2 curvature(vec3 p)
{
	float eps=0.01,d=distFunc(p);	
	vec3 dFa=vec3(distFunc(p+vec3(eps,0.0,0.0)),distFunc(p+vec3(0.0,eps,0.0)),distFunc(p+vec3(0.0,0.0,eps)));
	vec3 dFb=vec3(distFunc(p-vec3(eps,0.0,0.0)),distFunc(p-vec3(0.0,eps,0.0)),distFunc(p-vec3(0.0,0.0,eps)));
	vec3 dF=0.5*(dFa-dFb)/eps;
    	vec3 d2F=(dFa+dFb-2.0*d)/eps/eps;
    	float d2Fxy=0.5*(distFunc(p+vec3(eps,eps,0.0))-distFunc(p+vec3(eps,0.0,0.0))-distFunc(p+vec3(0.0,eps,0.0))+2.*d-distFunc(p+vec3(-eps,0.,0.))-distFunc(p+vec3(0.,-eps,0.))+distFunc(p+vec3(-eps,-eps,0.)))/eps/eps;
    	float d2Fxz=0.5*(distFunc(p+vec3(eps,0,eps))-distFunc(p+vec3(eps,0,0))-distFunc(p+vec3(0,0,eps))+2.*d-distFunc(p+vec3(-eps,0,0))-distFunc(p+vec3(0,0,-eps))+distFunc(p+vec3(-eps,0,-eps)))/eps/eps;
    	float d2Fyz=0.5*(distFunc(p+vec3(0,eps,eps))-distFunc(p+vec3(0,0,eps))-distFunc(p+vec3(0,eps,0))+2.*d-distFunc(p+vec3(0,0,-eps))-distFunc(p+vec3(0,-eps,0))+distFunc(p+vec3(0,-eps,-eps)))/eps/eps;
    	vec3 d2Fx=vec3(d2F.x,d2Fxy,d2Fxz);
	vec3 d2Fy=vec3(d2Fxy,d2F.y,d2Fyz);
	vec3 d2Fz=vec3(d2Fxz,d2Fyz,d2F.z);
	mat4 H;
	H[0]=vec4(d2Fx,dF.x);
	H[1]=vec4(d2Fy,dF.y);
	H[2]=vec4(d2Fz,dF.z);
	H[3]=vec4(dF,0);  
	float D=determinant(H);
	d=dot(dF,dF);
	float G=-D/(d*d);
	mat3 K=mat3(H);
	float f=dot(K*dF,dF)-d*dot(d2F,vec3(1,1,1));
	float l=length(dF);
	float M=0.5*f/l/d;
	float k=sqrt(M*M-G);
	return vec2(M+k,M-k);	
}


vec3 normal(vec3 p) {
	float d = 0.001;
	return normalize(vec3(
		distFunc(p + vec3(d, 0, 0)) - distFunc(p + vec3(-d, 0, 0)),
		distFunc(p + vec3(0, d, 0)) - distFunc(p + vec3(0, -d, 0)),
		distFunc(p + vec3(0, 0, d)) - distFunc(p + vec3(0, 0, -d))));
}

float c=cos(0.2*time),s=sin(0.2*time);
mat2 rotX=mat2(c,s,-s,c);
float att(float x)
{
	return 1.0/(1.0+0.5*x+0.5*x*x);	
}
void main( void ) {

	vec2 position = 6.0*( gl_FragCoord.xy - 0.5*resolution.xy )/min(resolution.x,resolution.y);
	vec3 pos=vec3(position,2.0),
		//eyepos=vec3(0.,0.0,4.0), JTS 20211211
		dir= vec3(0.,0.,-1.),//normalize(pos-eyepos),
		dirlight=normalize(vec3(-0.4,0.8,2.0)),
		lightpos=vec3(-1.0,3.0,4.0),
		lightdir=normalize(pos-lightpos);
	vec3 diffuse=vec3(0.5,0.,0.);
	pos.xz*=rotX,dir.xz*=rotX,lightdir.xz*=rotX,dirlight.xz*=rotX;
	pos.yz*=rotX,dir.yz*=rotX,lightdir.yz*=rotX,dirlight.yz*=rotX;
	vec2 target[4];
	vec4 dist;	
	vec3 color=vec3(0.2,0.2,0.2),col[4],norm[4],ref[4],material=vec3(0.1,0.2,0.1),mLightd=vec3(1.0,0.0,1.0),mLightp=vec3(0.0,1.0,.0);
	float lid[4],lip[4];
	float atti[4];
	
	float intersection=QuadricRoot(pos,dir,target);
	if(intersection==0.0)color=vec3(0.0,0.0,0.0);
	else{
		float signf=-1.0;
		for(int i=0;i<4;i++){
			signf*=(-1.0);
			if(abs(target[i].y)<1.0e-5){			
			vec3 p=pos+dir*target[i].x;
			vec2 Cvt=curvature(p);
			Cvt=mod(Cvt*2.0,1.0)-0.5;
			Cvt=smoothstep(0.0,0.1,abs(Cvt));
			float grid=0.5*(Cvt.x*Cvt.y);
			norm[i]=signf*normal(p);
			ref[i]=reflect(lightdir,norm[i]);
			float ld=max(dot(norm[i],dirlight),0.0);
			float lp=(max(dot(-dir,ref[i]),0.0));			
			lid[i]+=ld+pow(ld,128.0);
			lip[i]+=lp+pow(lp,128.0);
			atti[i]=att(target[i].x);
			color+=grid*atti[i]*(lid[i]*mLightd+lip[i]*mLightp);
		}
		}
//		color+=diffuse;	
	}
	gl_FragColor = vec4( color, 1.0 );

}