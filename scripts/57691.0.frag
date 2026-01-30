#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M(x,y) mod(x,y) - y/2.

const float pi = acos(-1.);
const float pi2 = pi *2.;
float dsphere(vec3 p, float s)
{
	return length(p) - s;
}

float dbox(vec3 p,vec3 s)
{
	p = abs(p) - s;
	return max(p.x,max(p.y,p.z));
}

mat2 rot(float a)
{
	float s = sin(a),c = cos(a);
	return mat2(s,c,-c,s);
}

vec2 pmod(vec2 p , float r)
{
	float a = atan(p.x,p.y) + pi/r;	
	float n = pi2/r;
	a = floor(a/n) * n;
	return p * rot(-a);
}

vec3 IFS(vec3 p)
{
	for(int i = 0; i < 4 ; i++)
	{
		p = abs(p) - 1.;
		p.xz = rot(1.) * p.xz;
		p.xy = rot(1.) * p.xy;
	}
	return p;
}

float dist(vec3 p)
{
	//p = IFS(p);
	
	vec3 s = vec3(0.5);
	float bo = dbox(p , s);
	
	p = M(p,3.);
	for(int i = 0; i < 4 ; i++)
	{
		p = abs(p) - 1.;
		p.xz *= rot(1.);
		p.xy *= rot(1.);
	}
	
	
	p.yz = pmod(p.yz  , 4.);
	p.xy = pmod(p.xy  , 4.);
	//float sp = dsphere(p,0.1);
	
	return min(bo,dbox(p,s));
}

vec3 getNormal(vec3 p)
{
	vec3 d = vec3(0.001,0.,0.);
	
	return normalize(vec3(
		dist(p.x + d) - dist(p.x - d),
		dist(p.y + d.yxz) - dist(p.y - d.yxz),
		dist(p.z + d.zyx) - dist(p.z - d.zyx)
	));
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy * 2.- resolution.xy )/min(resolution.x,resolution.y);
	vec3 color = vec3(.0);
	
	float t = time*2.;
	
	p *= rot(t/20.);
	
	vec3 light = vec3(0.,0.,2.);
	vec3 cp = vec3(0.,0.,-10.);
	vec3 cd = vec3(0.,0.,1.);
	vec3 cu = vec3(0.,1.,0.);
	vec3 cs = cross(cd , cu);
	
	cp += cd * t;
	cp += cu * 3.* clamp(cos(t/4.),-0.5,0.5);
	cp += cs * 3. * clamp(sin(t/4.),-0.5,0.5);
	//cp.xy += rot(t / 20.) * cp.xy;
	//cd.xz = rot(t) * cd.xz;
	//cu.xy = rot(t) * cu.xy;
	
	
	float target = 2.5;
	
	vec3 rd = normalize(vec3(cu * p.y + cs * p.x + cd * target));
	
	float depth = 0.0;
	float ac = 0.0;
	vec3 normal;
	for(int i = 0; i < 99 ; i++)
	{
		vec3 rp = cp + rd * depth;
		float d = dist(rp);
		//d = max(d , 0.001);
		if(d < 0.001)
		{
			normal = getNormal(rp);
			break;
		}	
		ac += exp(-d * 3.);
		depth += d;
	}
	
	color = vec3(ac/10.,ac/30.,ac/50.);
	color *= dot(normal,light);
	gl_FragColor = vec4( color, 1. );

}