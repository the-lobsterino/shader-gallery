#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//sphinx

vec2 hash(vec2 uv) 
{	
	return pow(mod(uv.yx, 2.)-.34, vec2(2.));
}

float voronoi(vec2 v)//via iq+unrolled
{
	vec2 lattice 	= floor(v);
	vec2 field 	= fract(v);
			
	float result = 8.0;

	result		= min(length(vec2(-1.0, -1.0) - field + hash(lattice + vec2(-1.0, -1.0))), result); 
	result		= min(length(vec2(0.0, -1.0) - field + hash(lattice + vec2(0.0, -1.0))), result); 
	result		= min(length(vec2(1.0, -1.0) - field + hash(lattice + vec2(1.0, -1.0))), result); 
	result		= min(length(vec2(-1.0, 0.0) - field + hash(lattice + vec2(-1.0, 0.0))), result); 
	result		= min(length(vec2(0.0, 0.0) - field + hash(lattice + vec2(0.0, 0.0))), result); 
	result		= min(length(vec2(1.0, 0.0) - field + hash(lattice + vec2(1.0, 0.0))), result); 
	result		= min(length(vec2(-1.0, 1.0) - field + hash(lattice + vec2(-1.0, 1.0))), result); 
	result		= min(length(vec2(0.0, 1.0) - field + hash(lattice + vec2(0.0, 1.0))), result); 
	result		= min(length(vec2(1.0, 1.0) - field + hash(lattice + vec2(1.0, 1.0))), result);

	return result;
} 


void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);
	
	float scale 	= 8.;
	
	vec2 position	= (uv-.5)*aspect;
	position	= position * scale;
	
	float result	= voronoi(position);

//	result 	 	= pow(1.-result, 1.)*1.;
	
	gl_FragColor = vec4(result);

}