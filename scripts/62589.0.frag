#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct ray
{
	vec3 o;
	vec3 d;
	float l;
};
	
float sdfSphere(vec3 p)
{
	return length(p - vec3(sin(time * 0.2)*0.3,0.,1.5)) - 0.4;
}
	
float geo(vec3 p)
{
	return min(sdfSphere(p), p.y + 0.3);	
}
	
vec3 geoCol(vec3 p)
{
	if(sdfSphere(p) < (p.y + 0.3)) return vec3(0.8,0.2,0.2);
	else return vec3(0.2,0.8,0.6);
}


vec4 march(ray r)
{
	vec3 col = vec3(1.0);
	for(int i = 0; i < 84; i++)
	{
		vec3 p = r.o + r.d * r.l;
		r.l += geo(p);
		col = geoCol(p).rgb;
		
		if(r.l > 24.) break;
	}
	return vec4(col, r.l);
}

vec3 normal(vec3 p)
{
	vec2 of = vec2(0.001, 0.0);
	float copy = geo(p);
	return normalize(copy - vec3(geo(p - of.xyy), geo(p - of.yxy), geo(p - of.yyx)));
}

float shadow(vec3 ro, vec3 rd, float k)
{
	float res = 1.0;
	float t = 0.01;
	for(int i = 0 ; i < 32; ++i)
	{
		float g = geo(ro + rd * t);
		res = min(res, k * g/t);
		t += g;
		if(g < 0.00001 || g > 1.0)
			break;
	}
	return clamp(res,0.0,1.0);
}
	
float lighting(vec3 p, vec3 lp)
{
	vec3 lPos = normalize(lp - p);
	vec3 n = normal(p);
	
	float light = clamp(dot(n, lPos), 0.0, 1.0);
	light *= shadow(p, normalize(lp), 2.0);
	
	return light;
}



void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	uv.x *= resolution.x/resolution.y;

	vec3 lPos = vec3(sin(time * 1.0)*1.5,1.5,cos(time * 1.0)*1.5);
	ray r;
	r.o = vec3(0.);
	r.d = vec3(uv, 1.0);
	vec4 l = march(r);
	vec3 m = r.o + r.d * l.w;
	vec3 col = l.rgb * lighting(m, lPos);
	col *= exp( -0.05*l.w*l.w*l.w);
	
	gl_FragColor = vec4(col,1.0);

}