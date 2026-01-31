#extension GL_OES_standard_derivatives : enable
#define ne 0.0
#define fa 50.0
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float c(vec3 p,vec3 b)
	{
	vec3 d = abs(p)-b;
	return length(max(d,0.0))+min(max(d.x,max(d.y,d.z)),0.0);
		}
float m(vec3 p)
	{
	return c(p,vec3(1.0));
		}
float gd(vec3 e,vec3 r)
	{
	float depth = ne;
	for(float i=0.0;i<100.0;i++)
		{
		float di = m(e+depth*r);
		if(di<=ne)
			{
			return depth;
				}
		depth += di;
		if(di>=50.0)
			{
			return fa;
				}
			}
	return fa;
		}
vec3 gn(vec3 p)
	{
vec2 e = vec2(-0.05,0.05);
return normalize(vec3(
m(vec3(p+e.xyy))-m(vec3(p-e.xyy)),
m(vec3(p+e.yxy))-m(vec3(p-e.yxy)),
m(vec3(p+e.yyx))-m(vec3(p-e.yyx))
	));
		}
vec3 gr(vec2 p,float fo,vec3 e,vec3 t,vec3 u)
	{
	vec3 d = normalize(e-t);
	vec3 s = normalize(cross(u,d));
	float z = -u.y/tan(radians(fo));
	return normalize(s*p.x+u*p.y+d*z);
		}
vec4 ren(vec2 p,float ti)
	{
float f,di,df;
vec3 e,t,u,n,r;
f = 50.0;
e = vec3(2.0);
t = vec3(0.0);
u = vec3(0.0,1.0,0.0);
r = gr(p,f,e,t,u);
di = gd(e,r);
if(di==50.0)
	{
return vec4(0.0);	
		}
n = gn(e+di*r);
df = dot(n,normalize(vec3(1.0)));
return vec4(vec3(df),1.0);
		}
void main( void ) {
	vec2 p = 2.0*gl_FragCoord.xy/resolution-vec2(1.0);
	gl_FragColor = ren(p,time);

}