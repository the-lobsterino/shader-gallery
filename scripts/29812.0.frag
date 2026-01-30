#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

vec3 barycentric(vec2 uv)
{	
	uv.y		*= 0.57735026918	; //1./sqrt(3.);	
	vec3 uvw		= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
	uvw		*= .86602540358;
	return uvw;
}


vec2 cartesian(vec3 uvw)
{
	uvw.xy		-= uvw.z;
	uvw.xy		*= 0.57735026918	; //1./sqrt(3.);	
	vec2 uv 		= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
	uv.y		*= .57735026919;
	return uv;
}

bool winding(vec3 uvw)
{
	return mod(dot(floor(uvw), vec3(1.)), 2.) == 0.;
}


vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.zxy : uvw;
}


vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}

float tran(float x)
{
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}


#//projection
vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 		= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}

vec2 cross(in vec2 uv)
{
	return vec2(-uv.y, uv.x);
}


#//fields
float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


float sphere(vec2 position, float radius)
{
	return length(position)-radius;
}


#//lines
float contour(float x, float w)
{
	return 1.-clamp(x * .25 * min(resolution.x, resolution.y) * w, 0., 1.);
}

float contour(float x)
{
	return contour(x, .25/mouse.y);
}



mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	
	return 	mat2( c, s, -s, c);
}


void main( void ) 
{
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	
	
	vec2 aspect	= resolution.xy/resolution.xx;
	float scale	= mouse.y*32.;
	
	uv		= (uv    * scale - scale * .5) * aspect;
	vec2 mp		= (mouse * scale - scale * .5) * aspect;
	
	uv.y		+= .5;
	mp.y		+= .5;
	

	vec3 b		= vec3(0.);
	vec3 field	= vec3(0.);
	vec3 m		= vec3(0.);

	vec3 position	= vec3(0.);
	vec3 basis_mask = vec3(0.);
	vec3 slope_mask = vec3(0.);	
	vec3 basis	= vec3(0.);	
	vec3 border	= vec3(0.);
	vec3 slope	= vec3(0.);
	vec4 result	= vec4(0.);
	for(int i = 0; i<3; i++)
	{
		position.x 	+= (m.y-m.z)-(b.y-b.z);
		position.y 	+= (m.x-m.y)-(b.x-b.y);
		position.z 	+= (m.z-m.x)-(b.z-b.x);
	
		
		slope		= cross(m, b);
	
		
		basis_mask.x	= float(slope.x < position.y);
		basis_mask.y 	= float(slope.x < position.y);
		basis_mask.z 	= float(slope.z > position.y);
	
		
		slope_mask.x 	= float(slope.x < slope.y);
		slope_mask.y	= float(slope.x < slope.y);
		slope_mask.z	= float(slope.z < slope.x);
	
	
		basis.x 		+= contour(abs(position.x));
		basis.y 		+= contour(abs(position.y));
		basis.z 		+= contour(abs(position.z));
		basis		*= basis_mask;
	
		
		border.yz 	+= contour(abs(slope.x)/length(m.yz*2./3.)) * slope_mask.x;
		border.xz 	+= contour(abs(slope.y)/length(m.xz*2./3.)) * slope_mask.y;
		border.xy	+= contour(abs(slope.z)/length(m.xy*2./3.)) * slope_mask.z;
		
		uv 		*= rmat(mouse.x*(8.*atan(1.)));
		
		b 		= barycentric(uv);
		field		= b;

		m		= barycentric(mp);
		field 		= b;
		b		= wind(b);
		b 		= fract(b);

		m 		= wind(m);
		m		= fract(m);
			
		//result.xyz	= fract(field)*.5;
		result.xyz	+= basis; 
		result.xyz	+= border;
		result		+= contour(b.x*2.)+contour(b.y*2.)+contour(b.z*2.);			
	}
	

	gl_FragColor = result ;
}//sphinx


