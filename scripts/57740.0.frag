#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi * 2.;

mat2 rot(float a)
{
	float s = sin(a) , c = cos(a);
	return mat2(s,c,-c,s);
}

vec2 pmod(vec2 p,float r)
{
	float a = atan(p.x,p.y) + pi/r;
	float n = pi2/r;
	a = floor(a/n) * n;
	return p * rot(a);
	
}

float dbox(vec3 p , float s)
{
	p = abs(p)- s;
	return max(max(p.x,p.y),p.z);
}

float dist(vec3 p )
{
	for(int i = 0; i  < 4;i++)
	{
		p.x = abs(p.x) - 0.01;
		p.xy *= rot(0.2);
		p.yz *= rot(1.);
		
	}
	p.xy = pmod(p.xy, 4.);
	p = mod(p,3.) - 3./2.;
	float s =  0.7 + 0.3 * sin(time/2.);
	float d = dbox(p,s);
	return d;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy )/ min(resolution.x,resolution.y);

	
	p *= rot(time/20.);
	vec3 color = vec3(0.);
	
	float t = time * 3.;
	vec3 cp = vec3(0.,0.,-10.);
	vec3 cd = vec3(0.,0.,1.);
	vec3 cu = vec3(0.,1.,0.);
	vec3 cs = cross(cd , cu);
	
	cp += cd * t/3. * 0.5;
	cp += cs * 5.* fract(sin(t/30.));
	
	
	float target = 2.5;
	
	vec3 rd = normalize(vec3(cd * target + cu * p.y + cs * p.x));
	
	float depth= 0.0;
	float ac = 0.0;
	
	for(int i = 0; i < 99; i++)
	{
		vec3 rp = cp + rd * depth;
		float d = dist(rp);
		d = max(d,0.01);
		ac += exp(-d * depth);
		depth += d;
	}
	
	color = vec3(ac/300.);
	
	gl_FragColor = vec4(color,1.);

}