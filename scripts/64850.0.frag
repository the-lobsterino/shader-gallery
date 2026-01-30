#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct ray
{
	vec3 o,d;
	float l;
};
	
float orbit_Earth = 0.5;
float speed_Earth = 1.;
	
vec4 opu(vec4 a, vec4 b)
{
	if(a.w < b.w) return a;
	else return b;
}
	
vec4 geo(vec3 p)
{
	return opu
	(
		vec4(vec3(0.9,0.9,0.2)*200., length(p - vec3(0.,0.,0.))-0.09), //---Sun
		vec4(0.1,0.6,0.2, length(p - vec3(sin(time * speed_Earth)*orbit_Earth,0.,cos(time * speed_Earth)*orbit_Earth))-0.02)
	);	
}
	
vec4 march(ray r)
{
	vec3 c = vec3(0.);
	for(int i = 0; i < 34; i++)
	{
		vec3 p = r.o + r.d * r.l;
		vec4 g = geo(p);
		r.l += g.w;
		c = g.rgb;
		if(r.l > 8.)
			break;
	}
	return vec4(c, r.l);
}

vec3 normal(vec3 p)
{
	vec2 of = vec2(0.001, 0.);
	float copy = geo(p).w;
	return normalize(copy - vec3(geo(p - of.xyy).w, geo(p - of.yxy).w, geo(p - of.yyx).w));
}

float lighting(vec3 p)
{
	vec3 lPos = vec3(0., 0., 0.);
	vec3 lpos = normalize(lPos - p);
	vec3 n = normal(p);
	
	float light = clamp(dot(lpos, n),0.1,1.);
	float s = pow(max(dot(lpos, n), 0.0),120.)*3.;
	light+=s;
	
	float t = 0.05;
	float r = 1.2;
	for(int i = 0; i < 4; i++)
	{
		float g = geo(p+(lpos+n)*t).w;
		r = min(r, 2. * g/t);
		t+=g;
		if(g<.001)
			break;
		if(t < 0.001 || t > 8.0)
			break;
	}
	r = clamp(r,0.1,1.);
	light*=r*2.;
	return light;
}

mat2 rot(float a)
{
	return mat2(cos(a),-sin(a),sin(a),cos(a));	
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy -0.5 * resolution.xy ) / resolution.y;

	vec3 c = vec3(0.);
	
	ray r;
	r.o = vec3(0.,0.5,-1.2);
	r.d = vec3(uv, 1.);
	r.d.zy*=rot(-0.5);
	
	vec4 m = march(r);
	vec3 p = r.o + r.d * m.w;
	c = m.rgb * lighting(p);
	c*=exp(-0.1 * pow(m.w,3.));
	
	gl_FragColor = vec4( c, 1.0 );

}