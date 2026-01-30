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
	
float rand(vec2 n) 
{ 
	return fract(sin(dot(n, vec2(16.9898, 4.1414))) * 43758.5453);
}
	
vec4 geo(vec3 p)
{
	vec3 p0 = p;
	p0.y *= pow(p.y,1.) * sin(time * 2.)*5.5;
	float a = length(p0 - vec3(sin(time * 1.)*0.5,0.,1.5))-0.35;
	float b = p.y + 0.35;
	if(a < b) return vec4(0.5,0.6,0.45, a);
	else return vec4(0.1,0.8,0.4, b);
}
	
vec4 march(ray r)
{
	vec3 c = vec3(0.);
	for(int i = 0; i < 64; i++)
	{
		vec3 p = r.o + r.d * r.l;
		vec4 g = geo(p);
		r.l += g.w;
		c = g.rgb;
		if(r.l > 16.)
			break;
	}
	return vec4(c, r.l);
}

vec3 normal(vec3 p)
{
	vec2 of = vec2(0.001,0.);
	float copy = geo(p).w;
	return normalize(copy - vec3(geo(p-of.xyy).w,geo(p-of.yxy).w,geo(p-of.yyx).w));
}

float lighting(vec3 p)
{
	vec3 lPos = vec3(sin(time * 1.)*.5,1.,-0.5);
	vec3 lpos = normalize(lPos - p);
	vec3 n = normal(p);
	
	float s = pow(max(dot(lpos,n),0.0), 500.)*5.;
	
	float l = clamp(dot(lpos,n),0.,1.) + s;
	
	float t = 0.01;
	float res = 1.0;
	for(int i = 0; i < 16; i++)
	{
		float g = geo(p+(lpos+n)*t).w;
		res = min(res, 2. * g/t);
		if(g < 0.001)
			break;
		t += g;
		if(t < 0.001 || t > 8.)
			break;
	}
	
	l*=res;
	
	return l;
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy -0.5 *  resolution.xy ) /resolution.y;

	vec3 c = vec3(0.);
	
	ray r;
	r.d = vec3(uv, 1.);
	
	vec4 m = march(r);
	vec3 p = r.o + r.d * m.w;
	c = m.rgb * lighting(p);
	c *= exp(-0.001 * pow(m.w,2.));
	c+=rand(uv)*0.045;

	gl_FragColor = vec4(c, 1.0 );

}