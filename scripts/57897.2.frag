#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M(x,y) mod(x,y)-y/2.

const float pi  =acos(-1.);
const float pi2 = pi *2.;

struct RayTrace{
    vec3 cp;
    vec3 rd;
    vec3 cs;
    vec3 cu;
    vec3 cd;
    vec2 p;
    vec3 color;
    vec3 normal;
};

mat2 rot(float a)
{
	float s = sin(a),c = cos(a);
	return mat2(s,c,-c,s);
}

vec2 fmod(vec2 p,float r)
{
	float a = atan(p.x,p.y) + pi/r;
	float n = pi2/2.;
	a = floor(a/n)*n;
	return p * rot(a);
}
	
float hash3(vec3 p)
{
	return fract( fract(sin(p.x)+1234.567)+fract(sin(p.y)+5224.567)+fract(sin(p.z)+8234.567));
}

float hash2(vec2 p)
{
	return fract(dot(sin(p.x),p.y) + 982.71);
}

float smin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}
	
float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0)) - r
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}
	
float dist(vec3 p)
{
	vec3 pb = p;
	pb.yz = M(pb.yz,0.5);
	
	//pb.yz = fmod(pb.yz,10.);
	vec3 box1 = pb + vec3(3.,0.,0.);
	vec3 box2 = pb- vec3(3.,0.,0.);
	box1.xy = fmod(box1.xy,3.);
	
	
	vec3 seed = floor(p/5.)*5.;
	//float id = hash3(seed);
	float finness = 2.5;
	vec2 id = floor(p.yz/finness)*finness;
	float speed = hash2(id) * 1000.;
	
	float timing = mod(time-speed,15.) - 7.5;
	vec3 d1p = p + vec3(timing,0.,0.);
	d1p.yz = M(d1p.yz,2.5);
	vec3 boxSize = vec3(0.1,0.1,0.1);
	float s = length(p) - 0.01;
	
	vec3 datasize = vec3(0.4,0.4,0.4);
	float data1 = sdBox(d1p,datasize);
	
	float rBox1 = sdRoundBox(box1,boxSize,0.2);
	float rBox2 = sdRoundBox(box2,boxSize,0.2);
	float wall = smin(rBox1,rBox2,0.5);
	return smin(data1,wall,1.5);
	//return rBox;
}

float dist2(vec3 p)
{
	
	p.z = M(p.z,3.);
	for(int i =0;i < 5;i++)
	{
		p.x = abs(p.x) - 1.1;
		p.xy *= rot(1.);
		p.y = abs(p.y) - 0.5;
		p.yz *= rot(1.5) ;
	}
        p.xz *= rot(3.* sin(time/100.));
	p = M(p,3.);
	float s = sdBox(p,vec3(0.5));
	
	
	return s;
}

vec3 getNormal(vec3 p)
{
	vec3 d = vec3(0.001,0.,0.);
	return normalize(vec3(
		dist(p + d) - dist(p - d),
		dist(p + d.yxz) - dist(p - d.yxz),
		dist(p + d.zyx) - dist(p - d.zyx)
	));
}

vec3 hsv(vec3 hsv)
{
	float h = hsv.x;
	float s = hsv.y;
	float v = hsv.z;
	return ((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

RayTrace raymarching2(RayTrace ri)
{
    RayTrace ro;
	ro= ri;
	ri.cp += ri.cd * time * 0.5;
	ro.rd = normalize(vec3(ri.p.x * ri.cs + ri.cu * ri.p.y + ri.rd * 2.5));
	
	vec3 light = vec3(0.,1.,0.);
    	float  depth = 0.;
	vec3 normal = vec3(0.);
	float ac = 0.0;
	for(int i = 0; i< 90 ; i++)
	{
		vec3 rp = ro.cp + ro.rd * depth;
		float d = dist2(rp);
		d= max(0.001,abs(d));
		ac += exp(-d * 3.);	
		depth += d;
	}
	ro.normal = normal;
	float h = ac/500. * sin(time/10.);
	float s = ri.color.g*ac/100.;
	float v = ri.color.r/ac ;
	vec3 color = vec3(h,s,v);
	ro.color = color;
    return ro;
}
	
RayTrace raymarching(RayTrace ri)
{
    RayTrace ro;
	ro = ri;
	ro.p = vec2(-1.);
	vec3 light = vec3(0.,1.,0.);
    	float  depth = 0.;
	vec3 normal = vec3(0.);
	
	for(int i = 0; i< 79 ; i++)
	{
		vec3 rp = ri.cp + ri.rd * depth;
		float d = dist(rp);
		if(d < 0.001)
		{
			ro.color = vec3(1.);
			normal = getNormal(rp);
			ro.p = normalize(rp.zy );
			break;
		}
		depth += d;
	}
	ro.normal = normal;
	ro.color = ro.color * dot(normal,light);
	ro.color = abs(normal);
	ro.color = hsv(ro.color);
	if(ro.p.x > 0.)
	{
		ro = raymarching2(ro);
	}
    return ro;
}
    
void main( void ) {

	vec2 p = ( gl_FragCoord.xy *2. -  resolution.xy )/min(resolution.x,resolution.y);

	  vec3 col = vec3(0.);
    
	    RayTrace ro;
	    
	    vec3 cp = vec3(0.,0.,-5.);
	    vec3 cd = vec3(0.,0.,1.);
	    vec3 cu = vec3(0.,1.,0.);
	    vec3 cs = cross(cd , cu);
		
	   cd += vec3(0.,-0.1,0.);
	   cp += cd * time/2.;
	   cp += cu * time;
	
	    float target = 2.5;
	    vec3 rd = normalize(vec3(cd * target + cs * p.x + cu * p.y));

	ro.cp = cp;
	ro.rd = rd;
	ro.cd = cd;
	ro.p = p;
	ro.color = col;
	ro.normal = vec3(0.);
	RayTrace ri = raymarching(ro);
	gl_FragColor = vec4( ri.color, 1.0 );

}
