#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI 	(sqrt(5.)*.5+.5)
#define RPHI 	(sqrt(5.)*.5-.5)
#define TAU 	(8.*atan(1.))


float wave(float x)
{
    bool p  = fract(x*.5)<.5;
    x       = fract(x)*2.;
    x       *= 2.-x;
    x       *= 1.-abs(1.-x)*.25;
    return  p ? x : -x;
}

float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}


mat2 orbit(float t)
{
	vec2 r = vec2(wave(t+.5), wave(t));
	return mat2(r.x, r.y, -r.y, r.x);
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);		
}


bool winding(vec3 uvw)
{
	return mod(dot(floor(uvw), vec3(1.)), 2.) == 0.;
}


vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw : uvw;
}


vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}


vec3 barycentric(vec2 uv)
{	

	uv.y		/= 1.73205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
	uvw		*= .86602540358;
	return uvw;
}


vec2 cartesian(vec3 uvw)
{
	uvw 		= unwind(uvw);
	uvw.xy		-= uvw.z;
	uvw.xy		/= 1.73205080757;		
	vec2 uv 	= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
	uv.y		*= .57735026919;
	return uv;
}



float contour(float x)
{
	return step(x, .125);	
}


vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


float line(vec2 p, vec2 a, vec2 b)
{
	return contour(segment(p, a, b));
}



float log_phi_spiral(vec2 position)//via iq
{	
	float l = length(position);
	float a = atan(-position.y,position.x); 
	float v = log(l)/(log(PHI)) - a/TAU;   
	return v;
}
 
vec3 hash(vec3 uvw) 
{	
	float t = mod(time * .5, 512.);
	float s = log_phi_spiral(cartesian(uvw-uvw*log(uvw.xzy)) + t) * 512.;
	return abs(fract(vec3(1., 1., 1.) * s * .0625) - .5)*PHI;
}

float voronoi(vec3 uvw)//via iq
{
	vec3 lattice 	= floor(uvw);
	vec3 field 	= fract(uvw);	
	float result 	= 1.0;
	for(float k = -1.; k <= 1.; k++)
	{
		for(float j = -1.; j <= 1.; j++)
		{
			for(float i = -1.; i <= 1.; i++)
			{
				vec3 position	= vec3(i, j, k);
				vec3 weight	= position - field + hash(lattice + position);	
				result		= min(dot(weight, weight), result);

			}
		}
	}
	return sqrt(result);
}


float fbm(vec3 uvw)//via iq
{	
	float result 	= 0.;
	float amplitude = .5;
	float frequency = .25;
	for(float i = 0.; i < 8.; i++)
	{
		result		+= voronoi(uvw * frequency) * amplitude;	
		amplitude	*= .5;
		frequency 	*= PHI;
		uvw		+= uvw.zxy * frequency * RPHI * RPHI;
	}

	return result;
}

	
void main( void ) 
{
	float scale 			= 64.;
	vec2 aspect 			= resolution/max(resolution.x, resolution.y);
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	vec2 position_cartesian		= (uv-.5) * aspect * scale; 

	vec3 position_barycentric	= barycentric(position_cartesian + vec2(63., 31.));
	
	
	vec4 color 			= vec4(0.,0.,0.,1.);
	color 				+= fbm(position_barycentric);	
	color.xyz			-= log(color.xyz*2.5);
	
	gl_FragColor 			= color;

}