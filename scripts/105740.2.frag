#extension GL_OES_standard_derivatives : enable
#define ne 0.0
#define fa 50.0
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float s(vec3 p,float r)
	{
return length(p)-r;
		}
float c(vec3 p,vec3 b)
	{
vec3 d = abs(p)-b;
		return length(max(d,0.0))+min(max(d.x,max(d.y,d.z)),0.0);
		}
float m(vec3 p)
	{
return s(p,1.0);		
		}
float gd(vec3 e,vec3 r)
	{
float de = ne;
for(float i=0.0;i<100.0;i++)
	{
float di = m(e+de*r);
if(di<=0.01)
	{
return de;		
		}
de += di;
if(di>=fa)
	{
return fa;		
		}
		}
return fa;
		}
vec3 gn(vec3 p)
	{
vec2 e = vec2(-0.01,0.01);
return normalize(vec3(
m(vec3(p+e.xyy))-m(vec3(p-e.xyy)),
m(vec3(p+e.yxy))-m(vec3(p-e.yxy)),
m(vec3(p+e.yyx))-m(vec3(p-e.yyx))
));
		}
vec3 gr(vec2 p,float f,vec3 e,vec3 t,vec3 u)
	{
vec3 d = normalize(e-t);
vec3 s = normalize(cross(u,d));
float z = -u.y/tan(radians(f));
return normalize(s*p.x+u*p.y+d*z);
		}
void main( void ) {

	vec2 p = 2.0*gl_FragCoord.xy/resolution-vec2(1.0);
	vec3 a = gr(p,0.3,vec3(1.75),p.yxy,p.xxx);
	gl_FragColor = vec4(a.x*sin(time*20.0),fract(time),tan(time)*a.z,1.0);

}