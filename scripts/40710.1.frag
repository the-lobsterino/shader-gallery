#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//question - is there a single pass method to get the actual wall distances here?

vec2 hash(vec2 uv) 
{
	vec2 rq = mouse-.5;	
	return abs(fract(uv.yx * .5 + rq)-.5);
}


float minkowski(vec2 uv) 
{
	float t = mouse.y*2.+1.;
	return pow(pow(uv.x, t) + pow(uv.y, t), 1./t);
}
	


float voronoi(vec2 v)//via iq
{
	vec2 lattice 	= floor(v);
	vec2 field 	= fract(v);
	vec3 offset	= vec3(-1., 0., 1.) - .25;

	float result	= 1.;
	result		= min(minkowski(offset.xx - field + hash(lattice + offset.xx)), result); 
	result		= min(minkowski(offset.yx - field + hash(lattice + offset.yx)), result); 
	result		= min(minkowski(offset.zx - field + hash(lattice + offset.zx)), result); 
	result		= min(minkowski(offset.xy - field + hash(lattice + offset.xy)), result); 
	result		= min(minkowski(offset.yy - field + hash(lattice + offset.yy)), result); 
	result		= min(minkowski(offset.zy - field + hash(lattice + offset.zy)), result); 
	result		= min(minkowski(offset.xz - field + hash(lattice + offset.xz)), result); 
	result		= min(minkowski(offset.yz - field + hash(lattice + offset.yz)), result); 
	result		= min(minkowski(offset.zz - field + hash(lattice + offset.zz)), result);

	return result*result*2.;
} 

float fv(vec2 v)
{
	float f = 2.;
	float a = .5;
	
	float n = 0.;
	for(int i = 0; i < 12; i++)
	{
		n 	+= voronoi(v*f)*a;
		a	*= .5;
		f	*= 2.;
	}

	return n;
}


void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);	
	float scale 	= 1.;
	
	vec2 position	= (uv-.5) * aspect * scale;
	
	float result	= fv(position);
	
	gl_FragColor += result;
}//sphinx