#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


//visualization of mod(R, Q) sequences


#define Q 32.
#define R 25.


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float 	contour(float x);
float 	line(vec2 p, vec2 a, vec2 b);
float 	circle(vec2 position, float radius);
vec3 	hsv(float h,float s,float v);
float 	extract_bit(float n, float b);
float 	sprite(float n, vec2 p);
float 	digit(float n, vec2 p);
float 	print_digit(float index, vec2 position);
mat2 	rmat(float t);

void main( void ) 
{
	float scale		= 1.125;
	vec2 aspect		= resolution/min(resolution.x,resolution.y);
	vec2 uv			= floor(gl_FragCoord.xy)/resolution;
	
	vec2 p			=    (uv - .5) * aspect * scale;
	vec2 m			= (mouse - .5) * aspect * scale;	
	
	p.x			-= .325; //shift to the right
		
	
	float r			= R;	
	float q			= Q;

	
	float font_size		= .5;
	vec2 print_uv		= (ceil(((p * resolution/aspect))))*font_size;

	float q_arc		= 6.28/q;
	vec2 normal		= normalize(vec2(0., 1.));


	float r_range		= (resolution.y * .465) * font_size;
	float q_range		= (resolution.y * .535) * font_size;

	vec2 print_offset	= (vec2(5., 3.) * aspect.yx) * .5;
	
	float print		= 0.;
	float plot		= 0.;
	float sequence		= 0.;
	
	vec2 path_start		= normal * .5;
	vec3 color		= vec3(0.);
		for(float i = 0.; i < 128.; i++)
	{
		if(i < ceil(q * mouse.x))
		{	
			float rq	= mod(i * r, q);			
			
			mat2 q_rotation	= rmat( i * -q_arc);
			vec2 q_offset	= q_rotation * normal;						
						
			mat2 r_rotation = rmat(rq * q_arc);
			vec2 r_offset	= r_rotation * normal;			
			
			float list_i	= print_digit(  i,  print_uv - (resolution * font_size * vec2( .32, -i/q + .5)));
			float list_rq	= print_digit( rq,  print_uv - (resolution * font_size * vec2( .35, -i/q + .5)));

			float ring_i	= print_digit( rq,  print_uv - r_offset * r_range + print_offset);
			float ring_rq	= print_digit(  i,  print_uv - r_offset * q_range + print_offset);

			
			vec2 path_end	= normal * r_rotation * vec2(-.5, .5);
			float path_line	= line(p, path_start, path_end);
			path_start	= path_end;
			
			float hue	= q_arc/8.;
			color 		= print 	< list_i 	? hsv( i * hue, 1., 1.) : color + ring_i;
			color 		= print 	< list_rq 	? hsv(rq * hue, 1., 1.) : color + ring_rq;
			color		= plot  	< path_line 	? hsv( i * hue, 1., 1.) : color;
						
			print		= max(print, list_i);
			print		= max(print, list_rq);
			print		= max(print, ring_i);
			print		= max(print, ring_rq);
			
			plot	 	= max(plot, path_line); 			
		}
	}
			      
	vec4 result		= vec4(0., 0., 0., 0.);
	
	result.xyz		+= sequence * color;
	result.xyz		+= print * color;
	result.xyz		+= plot * color;
	result 			+= circle(p, .5);
	
	gl_FragColor		= result;
}//sphinx


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float contour(float x)
{
	return 1.-clamp(x * min(resolution.x, resolution.y) * .75, 0., 1.);
}


float line(vec2 p, vec2 a, vec2 b)
{
	b = b - a;
	a = p - a;
	return contour(distance(a, b * clamp(dot(a, b) / dot(b, b), 0., 1.)));
}



float circle(vec2 position, float radius)
{
	return contour(abs(length(position)-radius));
}


vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
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
float print_digit(float number, vec2 position)
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