#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define InR  0.16
#define OutR 0.64
#define EPS  0.001
#define Iter 10
vec4 rot;
vec3 dir;
vec4 cross(vec4 a, vec4 b)
{
return vec4(a.x*b.x-dot(a.yzw,b.yzw),a.x*b.yzw+b.x*a.yzw+cross(a.yzw,b.yzw));	
}
vec4 rotvec(float ang,vec3 axis)
{
	vec3 a=normalize(axis);
	return vec4(cos(ang/2.0),sin(ang/2.0)*a);
}
float DE2(vec3 p,vec2 t)
{
	vec2 q = vec2(length(p.xz)-t.x,p.y);
  	return length(q)-t.y;
}
float DE1(vec3 p,vec2 t)
{
	vec2 q = vec2(length(p.xy)-t.x,p.z);
  	return length(q)-t.y;	
}
float DeCub(vec3 p,vec3 size)
{
	p=cross(rot,vec4(0.0,p)).yzw;
	vec3 d = abs(p) - size;
        return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float TR2(vec3 p,vec2 t)
{
	float td=0.0;	
	for(int i=0;i<Iter;i++){
		
		float de=DeCub(p,vec3(0.1,0.3,0.4));

		if(de<EPS)return td;
		td+=de;
		p+=de*vec3(0.0,0.0,-1.0);
	}
	return td+1000.0;
}
float TR1(vec3 p,vec2 t)
{
	float td=0.0;	
	for(int i=0;i<Iter;i++){		
		float de=DE1(p,t);
		if(de<EPS)return td;
		td+=de;
		p+=de*vec3(0.0,0.0,-1.0);
	}
	return td+1000.0;
}
float TR(vec3 p,vec2 t)
{
	return min(TR1(p,t),TR2(p,t));
}
void main()
{
    	vec2 v=(gl_FragCoord.xy/resolution.y - vec2(0.5, 0.0))*10.0;
	vec2 u=mod(v,2.0)-1.0;
	vec2 s=vec2(OutR,InR);
	rot=rotvec(atan(1.0)*2.0,vec3(0.0,1.0,0.0));
	float r=TR(vec3(u,1.00),s);

	if(r<1000.0){
		float rx=TR(vec3(u.x+EPS,u.y,1.00),s),ry=TR(vec3(u.x,u.y+EPS,1.0),s);
		vec3 norm=normalize(cross(vec3(EPS,0.0,rx-r),vec3(0.0,EPS,ry-r)));
		vec3 light=normalize(vec3(sin(time),cos(time),1.5));
		r=dot(norm,light);
		float spec=pow(r,48.0);
		r+=spec;
	}
	else{r/=2000.0;r=r*r;}
	gl_FragColor = vec4(r,r,r,1.0);
}