#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void fold(inout vec2 p) 
{
	p = abs(p.yx);
}

float orbit(float x)
{
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*1.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}
	
mat3 orbital(vec3 r)
{
	vec3 a  = vec3(orbit(r.x+.5) * orbit(r.y+.5), orbit(r.y), orbit(r.x) * orbit(r.y+.5));
				
	float c = orbit(r.z+.5);
	float s = orbit(r.z);
	vec3 as 	= a*s;
	vec3 ac = a*a*(1.- c);
	vec3 ad = a.yzx*a.zxy*(1.-c);
	
	mat3 rot = mat3(
			c    + ac.x, 
			ad.z - as.z, 
			ad.y + as.y,
			ad.z + as.z, 
			c    + ac.y, 
			ad.x - as.x,
			ad.y - as.y, 
			ad.x + as.x, 
			c    + ac.z);
	
	return rot;	
}

vec3 orb;
mat3 rotation;
float map(vec3 p) 
{
	float s 		= 1.5;
	vec3 x 		= normalize(vec3(mouse.x,abs(mouse.x-mouse.y), mouse.y))*4.;
	const int it 	= 20;
	float u		= pow(s, -float(it) - 2.);
	
	orb 		= x;
	for(int i = 0; i < it; i++) 
	{
		
		p = abs(p*rotation) * s - x * .5;
	}
	orb = normalize(orb-p);
	return max(max(p.x, p.y), p.z)*u; //bah, euclid
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;
	
	for(int i = 0; i < 100; i++) {
		float d = map(ro + rd*t);
		if(d < 0.001*(1.0 + 3.0*t) || t >= 10.0) break;
		t += d;
	}
	
	return t;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.00001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - h.xyy),
		map(p + h.yxy) - map(p - h.yxy),
		map(p + h.yxy) - map(p - h.yyx)
	);
	return normalize(n);
}

mat3 camera(vec3 eye, vec3 lat) {
	vec3 ww = normalize(lat - eye);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	
	return mat3(uu, vv, ww);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	rotation = orbital(vec3(1., 1.1, 3.) * time * .0125);
	
	vec3 col = vec3(0);
	
	vec3 ro = 3.0*vec3(1, 0, -1.0);
	vec3 rd = normalize(camera(ro, vec3(0))*vec3(uv, 1.97));
	
	float i = march(ro, rd);
	if(i < 9.0) 
	{
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		
		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		
		col  = 0.2*vec3(1);
		col += 0.7*clamp(dot(key, nor), 0.0, 1.0);
		col += 0.1*clamp(dot(-key, nor), 0.0, 1.0);

		vec3 mat = mix(vec3(1), vec3(0.2, 0.8, 0.2), orb.x);
		mat = mix(mat, vec3(0.2, 0.2, .8), orb.y);
		mat = mix(mat, vec3(0.8, 0.2, 0.2), orb.z);
		
		col *= mat;
	}
	
	col = pow(sqrt(col*.5), vec3(1.6));
	
	gl_FragColor = vec4(col, 1);
}