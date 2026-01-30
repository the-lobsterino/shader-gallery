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

#define NUM_OCTAVES 5

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * (1.0 - voronoi(x));
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);
	
	float scale 	= 8.;
	
	vec2 position	= (uv-.5)*aspect;
	position	= position * scale;
	
	float result	= fbm(position);

//	result 	 	= pow(1.-result, 128.)*128.;
	
	gl_FragColor += result;

}