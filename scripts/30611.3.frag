//bitwise operators
//improved - next up, tree evaluation - sphinx


precision mediump float;


#extension GL_OES_standard_derivatives : enable


#define BITS 24
//#define AND
#define XOR


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print_index(float index, vec2 position);
float display_results(float a, float b, float c, vec2 p);
float bitwise(vec2 v);

void main( void ) 
{
	vec2 aspect	= resolution/min(resolution.x, resolution.y);
	vec2 uv		= gl_FragCoord.xy/resolution;

	float word	= pow(2., float(BITS));
	
	//n is the input of two values in the 0-1 range that will be compared bitwise at the wordsize defined by "BITS"
	vec2 n		= vec2(0.);
	n		= mouse;
	
	//generate the comparison shown on the right display
	float bits	= bitwise(n);
	vec2 display_uv	= (uv-.5)*aspect*212.;
	float display	= display_results(n.x, n.y, bits, display_uv);
	
	
	//draw the pattern
	n		= uv * aspect; 
	float field	= bitwise(n);
	
	
	//crosshair to show where the selected bits are on the pattern
	float crosshair	= float(floor(uv.x*resolution.x)==floor(mouse.x*resolution.x*.5) 
			||	floor(uv.y*resolution.y)==floor(mouse.y*resolution.y));
	
	//mask to prevent the pattern drawing on the right side
	float mask	= float(uv.x < min(resolution.x, resolution.y)/max(resolution.x, resolution.y));

	vec4 result	= vec4(0.);
	result		+= field;
	result 		+= crosshair;
	result 		*= mask;
	result		+= display;
	
	gl_FragColor	= result;
}//sphinx

float bitwise(vec2 v)
{
	float word	= pow(2., float(BITS));
	v		= floor(v*word)/word;
	float c		= 0.;
	for(int i=0; i < BITS; i++) 
	{
		vec2 n	= floor(v * word);

		#ifdef XOR
		c 	+= mod(n.x + n.y, 2.);
		#endif
		
		#ifdef AND
		c 	+= mod(n.x * n.y, 2.);
		
		#endif 
		
		c 	*= .5;
		v 	*= .5;;
 	}	
	return c;
}


float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}


float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}


float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}


float print_index(float index, vec2 position)
{	
	float result	= 0.;
	result 		+= index < 0. ? sprite(24., position+vec2(4., 0.)) : 0.;		
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
		if(index >= place || float(i) < 1.)
		{
			result	 	+= digit(abs(index/place), position);
			position.x 	+= 4.;
		}
	}
	return result;
}

float display_results(float a, float b, float c, vec2 p)
{
	float word = pow(2., float(BITS));
	a *= word;
	b *= word;
	c *= word;
	p.x -= 48.;

	
	float print	= 0.;
	vec2 print_uv	= floor(p);
	print		+= print_index(a, print_uv);	
	print		+= print_index(b, print_uv + vec2(0.,6.));		
	print		+= print_index(c, print_uv + vec2(0.,12.));	
	
	float bits	= 0.;
	float bit_scale	= 6.;	
	vec2 bits_uv	= floor(p/bit_scale);
	for(float i = 0.; i < float(BITS); i++)
	{
		if(bits_uv.x - 1. == i && bits_uv.y == 0.)
		{
			bits += extract_bit(a, i);
		}
		
		if(bits_uv.x - 1. == i && bits_uv.y == -1.)
		{
			bits += extract_bit(b, i);
		}
		
		if(bits_uv.x - 1. == i && bits_uv.y == -2.)
		{
			bits += extract_bit(c, i);
		}
	}
	
	
	float grid	= float(
			(fract(p.x/bit_scale) < .2 || fract(p.y/bit_scale) < .2) 
			&& bits_uv.x > 0. 
			&& bits_uv.x < float(BITS)+1.
			&& bits_uv.y > -3.
			&& bits_uv.y < 1. );
	
	return print + bits - grid;
}

