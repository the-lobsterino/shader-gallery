#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct ray
{
	vec3 o, d;
	float l;
};
	
vec4 opu(vec4 a, vec4 b)
{
	if(a.w < b.w) return a;
	else return b;
}
	
vec4 geo(vec3 p)
{
	vec3 pp = vec3(abs(p.x),p.yz);
	return opu(opu(vec4(0.2,0.2,0.4,length(pp - vec3(0.15,-0.2,1.))-0.2),
		   vec4(0.1,0.1,0.1, p.y + 0.2)),
		  vec4(0.2,0.2,0.4,length(vec3(p.x, p.y - clamp(p.y, 0.1, 0.5),p.z) - vec3(0.,-0.5,1.))-0.35));
}
	
vec4 march(ray r)
{
	vec3 c = vec3(0.0);
	for(int i = 0; i < 32; i++)
	{
		vec3 p = r.o + r.d * r.l;
		vec4 g = geo(p);
		c = g.rgb;
		r.l+=g.w;
		
		if(r.l > 16.)
			break;
	}
	return vec4(c,r.l);
}

vec3 normal(vec3 p)
{
	vec2 of = vec2(0.001,0.);
	float copy = geo(p).w;
	return normalize(copy - vec3(geo(p - of.xyy).w, geo(p - of.yxy).w, geo(p - of.yyx).w));
}

float lighting(vec3 p)
{
	vec3 LP = vec3(sin(time * 1.)*0.5,2.,-1.);
	vec3 lp = normalize(LP - p);
	vec3 n = normal(p);
	
	float l = clamp(dot(lp,n),0.,1.);
	float s = pow(max(dot(lp,n),0.),80.)*4.;
	l+=s;
	
	float r = 1.0;
	float t = 0.01;
	for(int i = 0; i < 12; i++)
	{
		float g = geo(p+(n+lp)*t).w;
		r = min(r, 1. * g / t);
		if(g < 0.001)
			break;
		t+=g;
		if(t < 0.001 || t > 8.0)
			break;
	}
	
	l *= r;
	
	return l;
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	vec3 c = vec3(0.0);
	ray r = ray(vec3(0.), vec3(uv,1), 0.0);
	
	vec4 m = march(r);
	vec3 p = r.o + r.d * m.w;
	
	c = m.rgb * lighting(p) * 3.;
	
	float s = sin(time * 2.0) * 1.;
	c += step(fract(clamp(s,0.0,1.0) + uv.y * time), .1) * 0.1;

	gl_FragColor = vec4(c, 1.0 );

}