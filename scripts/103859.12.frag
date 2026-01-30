#extension GL_OES_standard_derivatives : enable
#define near 0.0
#define far 50.0
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ran(float a)
	{
		return fract(sin(a*275.0)*225.0);
		}

float s(vec3 p,float r)
	{
		return length(p)-r;
		}
float c(vec3 p,vec3 b)
	{
		vec3 d = abs(p)-b;
		return length(max(d,0.0))+min(max(d.x,max(d.y,d.z)),0.0);
		}
float map(vec3 p)
	{
		return c(p,vec3(1.0));
		}
float gd(vec3 e,vec3 r)
	{
		float de = near;
		for(float i=0.0;i<100.0;i++)
			{
				float di = map(e+de*r);
				if(di<=0.0125)
					{
						return de;
						}
				de += di;
				if(di>=far)
					{
						return far;
						}
				}
		return far;
		}
vec3 gn(vec3 p)
	{
		vec2 e = vec2(-0.0125,0.0125);
		return normalize(vec3(
			map(vec3(p+e.xyy))-map(vec3(p-e.xyy)),
			map(vec3(p+e.yxy))-map(vec3(p-e.yxy)),
			map(vec3(p+e.yyx))-map(vec3(p-e.yyx))
			));
		}
vec3 gr(vec2 p,float fov,vec3 e,vec3 t,vec3 u)
	{
		vec3 d = normalize(e-t);
		vec3 s = normalize(cross(u,d));
		float z = -u.y/tan(radians(fov));
		return normalize(s*p.x+u*p.y+d*z);
		}
vec4 ren(vec2 p,float ti)
	{
		float fov,di,df;
		vec3 e,t,u,n,r;
		fov = 50.0;
		e = vec3(sin(time*0.25),2.0,2.0);
		t = vec3(0.0);
		u = vec3(0.0,1.0,0.0);
		r = gr(p,fov,e,t,u);
		di = gd(e,r);
		if(di==far)
			{
				float r,g,b;
				r = sin(p.x*p.x+p.y*p.y*time*0.1);
				g = cos(p.x*p.x+p.y*p.y*time*0.25);
				b = tan(p.x*p.x+p.y*p.y*time);
				return vec4(r,g,b,0.0);
				}
		n = gn(e+di*r);
		df = dot(n,normalize(vec3(1.0)));
		return vec4(vec3(df),1.0);
		}

void main( void ) {
	vec2 p = 2.0*gl_FragCoord.xy/resolution.xy-vec2(1.0);

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	vec4 ra = ren(p,time);
	gl_FragColor =  ra;

}