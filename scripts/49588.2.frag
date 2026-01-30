#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

float deLine(vec3 p,vec3 a,vec3 b)
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - 0.02;

}
vec3 dir=vec3(0.0,0.0,-1.0);
#define EPS 0.001
float trace(vec3 p,vec3 a,vec3 b,out vec3 target)
{
	float td=0.0;
	for(int i=0;i<30;i++){
		float de=deLine(p,a,b);
		p+=de*dir;
		td+=de;
		if(de<EPS){target=p;break;}
	}
	return td;
}
float pi2=atan(1.0)*8.0,da=pi2/20.0;
vec3 GetNormal(vec3 p,vec3 a,vec3 b)
{

		float d=deLine(p,a,b);
		float dx=deLine(vec3(p.x+EPS,p.y,p.z),a,b),dy=deLine(vec3(p.x,p.y+EPS,p.z),a,b);
		return normalize(vec3(dx-d,dy-d,EPS));	
}
void main() {
  vec2 pos = 1.0*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 p=vec3(pos,2.0),target,normal;
  float dist=100.0;
  vec3 va[20],vb[20];
	for(int i=1;i<20;i++){
		float n=float(i);
		va[i]=vec3(-0.2*cos(n*da),-1.0+0.1*n,-0.2*sin(n*da)),vb[i]=vec3(0.2*cos(n*da),-1.0+0.1*n,0.2*sin(n*da));
	}
	for(int i=1;i<20;i++){

		float d=trace(p,va[i],vb[i],target);
		if(d<dist){dist=d;normal=GetNormal(target,va[i],vb[i]);}
	}
	for(int i=1;i<19;i++){

		float d=trace(p,va[i],va[i+1],target);
		if(d<dist){dist=d;normal=GetNormal(target,va[i],va[i+1]);}
	}
	for(int i=1;i<19;i++){

		float d=trace(p,vb[i],vb[i+1],target);
		if(d<dist){dist=d;normal=GetNormal(target,vb[i],vb[i+1]);}
	}
	
 	if(dist<3.0){
		vec3 light=normalize(vec3(-1.0,1.0,4.0));
		float color=dot(normal,light);
		gl_FragColor=vec4(vec3(color),1.0);
	}
	else gl_FragColor=vec4(0.0);
}
