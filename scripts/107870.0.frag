#ifdef GL_ES
precision mediump float;
#endif

//not the gosper curve

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

vec3 barycentric(vec2 uv);
vec2 cartesian(vec3 uvw);	
bool winding(vec3 uvw);
vec3 wind(vec3 uvw);
vec3 unwind(vec3 uvw);

vec3 barycentric(vec2 uv)
{	
	uv.y		/= 1.33205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
	uvw		*= .86602540358;
	return uvw;
}


vec2 cartesian(vec3 uvw)
{
	uvw 		= unwind(uvw);
	uvw.xy		-= uvw.z;
	uvw.xy		/= 1.13205080757;	
	
	vec2 uv 	= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
	uv.y		*= .27735026919;
	return uv;
}

bool winding(vec3 uvw)
{
//	return mod(dot(floor(uvw), vec3(1., 1., 1.)), 2.) == 0.;
	vec2 uv 	= gl_FragCoord.xy/resolution;
	vec2 m	 	=  mouse * 3. ;

//	m		= uv.y < .75 ? floor(uv.x*12.+1.) : m;
	return mod(dot(floor(uvw), vec3(3., 2., 3.)), 6.) <= 1.;
}


vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.zxy : uvw;
}


vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}


float contour(float x, float r)
{
	return 1.-clamp(x * r * .1*max(resolution.x, resolution.x), 0., 1.);
}




float edge(vec2 p, vec2 a, vec2 b, float r)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return contour(distance(p, mix(a, b, u)), r);
}


void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 aspect	= resolution.xy/resolution.xx;
	float scale	= 9.;
	
	vec2 p 		= (uv-.5) * aspect * scale;
	vec3 uvw	= barycentric(p);
	float phi	= (sqrt(5.)+1.)*.5;
	vec3 b		= vec3(phi, phi * phi, phi * phi *phi);
	for(int i = 0; i < 6; i++)
	{
		uvw 	= wind(uvw);	
	
		uvw	*= vec3(1., 2. + log(time / 100.), 1.) * -2.;	
	//	uvw	= uvw.zxy;
	}
	
	vec3 t		= fract(uvw);
	
	float l 	= edge(t.yy-.4, vec2(1., .5), vec2(.5, .5), .05);
	

	
	vec4 result	= vec4(0., 0., 0., 1.);
	//result.xyz	+= t;
	result.xyz	+= l;
	
	gl_FragColor 	= result;
}//sphinx



