#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 hash(vec2 uv)
{
	return mod(mod(uv.yx * 25., 32.) * 25., 32.)/32.;
}


vec2 f2(vec2 uv)
{
	float phi = (sqrt(5.)+1.)*2.;
	return fract(-uv.yx*phi);
}

vec2 penta(vec2 uv) 
{	
	return pow(mod(uv.yx, 2.)-.34, vec2(2.));
}


float voronoi(vec2 v)//via iq
{
	vec2 lattice 	= floor(v);
	vec2 field 	= fract(v);
			
	float result = 8.0;
	for(float j = -1.; j <= 1.; j++)
	{
		for(float i = -1.; i <= 1.; i++)
		{
			vec2 position	= vec2(i, j);
			vec2 weight	= position - field + hash(lattice + position);

			result		= min(dot(weight, weight), result);
		}
	}
	return sqrt(result);
} 


void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);
	
	float scale 	= 32.;
	
	vec2 position	= (uv-.5)*aspect;
	position	= position * scale;

	
	float result	= voronoi(position);

//	result 	 	= pow(1.-result, 128.)*128.;
	
	gl_FragColor = vec4(result);

}