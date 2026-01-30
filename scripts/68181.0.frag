#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//bijective ulam spiral functions

//one function takes in an x,y coorinate and returns the matching distance along the spiral 
//the inverse takes in the distance along the spiral and returns the x,y position

//it breaks due to floating point precision once values get too large - boo floating point!


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//function header
float grid(float scale, vec2 coordinate);
float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print_number(float index, vec2 position);
float print_ulam_numbers(float n, float scale, vec2 print_coordinate);
float print_ulam_inverse(vec2 i, float scale, vec2 print_coordinate);



//maps coordinate p.xy to an ulam spiral number
float ulam_spiral(vec2 p)
{
	float x = abs(p.x);
	float y	= abs(p.y);
	bool q	= x > y;
	
	x	= max(x, y);
	y	= q ? abs(p.x+p.y) : abs(p.x - p.y);
	y 	= y + 4. * (x * x);
	x 	*= 2.;

	return  abs(p.x) <= abs(p.y)
		? (p.y > 0. ? y - x : y + x)
		: (p.x > 0. ? y - x - x : y);
}


//maps the distance n along the ulam spiral to an xy coordinate
vec2 inverse_ulam(float n)
{
	float r	= sqrt(n + .25);
	float s = 3. - fract(r) * 4.;	
	r	*= mod(r, 2.) > 1. ? .5 : -.5;	
	return s > 1. ? vec2(r, 2. * r - r * s) : vec2(r * s, r);
}




void main( void ) 
{
	float scale		= 16.;

	vec2 coordinate		= floor(gl_FragCoord.xy - .5 * resolution);
	
	vec2 field		= coordinate/scale;
	
	float spiral		= ulam_spiral(ceil(field));
	vec2 inverse		= inverse_ulam(ceil(spiral));

	float animation_input	= ceil(mod(time * scale * 3., max(resolution.x, resolution.y)));
	vec2 animated_inverse	= ceil(inverse_ulam(animation_input));
	float animated_spiral	= ulam_spiral(animated_inverse);		
	
	vec4 result		= vec4(0.);	

	vec2 inverse_on_floats  = inverse_ulam(ulam_spiral(field));		//show the floating point form of the spiral inversion (not ceiled) - wtf why a backwards spiral? *duh...*

	//print numbers and grid
	result			+= grid(scale, coordinate) * .35; 				
	result			+= print_ulam_numbers(spiral, scale, coordinate-vec2(2.)) * .125;
	result			+= print_ulam_inverse(ceil(inverse), scale, coordinate-vec2(2., 9.)) * .25;

	
	//animation
	result.z		+= float((animated_spiral-spiral) < 512.) * (clamp(256./floor(animated_spiral-spiral)/16., 0., 1.)) * 2.;
	result.y		+= float(abs(animated_inverse.x-ceil(field.x)) < .5) * .5;
 	result.x		+= float(abs(animated_inverse.y-ceil(field.y)) < .5) * .5;		
	result.w		= 1.;

	gl_FragColor		= result;
}//sphinx



//the rest of these functions are just for drawing the numbers and grid

//draws a grid
float grid(float scale, vec2 coordinate)
{
	return max(float(mod(coordinate.x, scale) < 1.), float(mod(coordinate.y, scale) < 1.));
}


//returns the bit 1 or 0 from number n at power b
float extract_bit(float n, float p)
{
	n = floor(n);
	p = floor(p);
	p = floor(n/pow(2.,p));
	return float(mod(p,2.) == 1.);
}


//draws the bits of n into a 3 by 5 sprite over p
float sprite(float n, vec2 p)
{
	p 		= floor(p);
	float bounds 	= float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}


//maps input n to the corrosponding float representing it's sprite graphic
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


//prints a number n
float print_number(float number, vec2 position)
{	
	float result	= 0.;
	result 		+= number < 0. ? sprite(24., position + vec2(4., 0.)) : 0.;		
	for(int i = 8; i >= 0; i--)
	{
		float place = pow(10., float(i));
		if(number >= place || float(i) < 1.)
		{
			result	 	+= digit(abs(number/place), position);
			position.x 	-= 4.;
		}
	}
	return result;
}


//prints all ulam numbers over the grid
float print_ulam_numbers(float n, float scale, vec2 print_coordinate)
{
	print_coordinate.x	= mod(print_coordinate.x, scale);
	print_coordinate.y	= mod(print_coordinate.y, scale);
	
	return print_number(n, print_coordinate);	
}


//prints all ulam numbers over the grid
float print_ulam_inverse(vec2 i, float scale, vec2 print_coordinate)
{
	print_coordinate.x	= mod(print_coordinate.x, scale);
	print_coordinate.y	= mod(print_coordinate.y, scale);
	
	return max(print_number(i.x, print_coordinate), print_number(i.y, print_coordinate - vec2(8., 0.)));	
}

