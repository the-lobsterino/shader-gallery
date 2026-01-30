#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = pi *2.;

float sphere(vec3 p)
{
	return length(p) - 0.1;
}

float box(vec3 p , vec3 o)
{
	p = abs(p) - o;
	return max(max(p.x,p.y),p.z);
}

mat2 rot(float a)
{
	float s = sin(a),c = cos(a);
	return mat2(s,c,-c,s);
}

vec2 pmod(vec2 p, float r)
{
	float a = atan(p.x,p.y) + pi/r;
	float n = pi2 / r;
	a = floor(a/n) * n;
	return  p * rot(-a);
}

float dis(vec3 p)
{
	p = mod(p,3.) - 3./2.;
	p.xz = pmod(p.xz,8.);
	vec3 o = vec3(0.1);
	float d = sphere(p);
	float b = box(p,o);
	return mix(b , d,(sin(time*length(p)+1.)/2.));
}

vec3 hsv(float h, float s , float v)
{
	return ((clamp(abs(fract(h + vec3(0.,2.,1.)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy )/min(resolution.x,resolution.y);
	
	
	float t = time * 3.;
	
	
	
	p = p * rot(t/30.);
	
	vec3 color = vec3(0.);
	
	vec3 cp = vec3(0.,0.,-5.);
	vec3 cd = vec3(0.,0.,1.);
	vec3 cu = vec3(0.,1.,0.);
	vec3 cs = cross(cd,cu);
	
	cp += cd * t;	
	
	float target = 2.5;
	
	vec3 rd = normalize(vec3(cu * p.y + cs * p.x + cd * target));
	
	float depth = 0.0;
	float ac = 0.0;
	
	vec3 rp;
	vec3 rotate = vec3(1.);
	
	for(int i = 0; i < 99 ; i++)
	{
		rp = cp + rd * depth;
		float d = dis(rp);
		d = max(d,0.001);
		ac += exp(-d * 3.);
		depth += d;
	}
	
	color = vec3(ac/100.);
	color = hsv((ac/100. ) * abs(sin(t/50.)),1.,depth/300.);
	
	gl_FragColor = vec4(color,1.);

}