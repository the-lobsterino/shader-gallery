precision highp float;
uniform vec2      	mouse;
uniform vec2      	resolution;
uniform sampler2D 	renderbuffer;
uniform float 		time;

//ray automata - added scale and field, things are about to get interesting
//still some sampling alignment issues to fix - works better at higher resolutions 

#define FREQUENCY 		(370./32.)
#define MAX_FLOAT		pow(2.,  8.)
#define MIN_FLOAT		pow(2., -8.)

#define DIVISIONS 		fract(time*32.)*32.

vec2 neighbor_offset(float i);	//8 offsets corrosponding to the ring of moore neighborhood positions ((0., -1.), (1., -1.), (1., 0.), (1., 1.)... etc)

float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print_index(float index, vec2 position);
float print_coordinates(float n, float scale, vec2 print_coordinate);

void main() 
{
	vec4 cell		= vec4(0.);
	
	float divisions		= DIVISIONS;
	vec2 scale 		= floor(resolution/divisions);
	
	vec2 uv			= gl_FragCoord.xy/resolution;
	
	vec2 field		= floor(gl_FragCoord.xy/resolution*scale)*FREQUENCY;
	
	vec2 print_uv		= mod(gl_FragCoord.xy-vec2(.5*resolution/scale), resolution/scale);
		
	
	
	for (float i = 0.; i < 8.; i++)
    	{	
		//get the neighbor cell by it's center
		vec2 offset		= neighbor_offset(float(i));
		
		
		vec2 neighbor_uv 	= gl_FragCoord.xy - neighbor_offset(float(i));
		neighbor_uv		= fract(neighbor_uv/resolution);

		vec4 neighbor 		= texture2D(renderbuffer, fract(neighbor_uv*divisions));
		
		float angle 		= neighbor.z;

		if (angle != 0.)
		{   
			//if so, rotate its angle based on the series 
			float sequence		= abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;
			sequence 		= fract(sequence) * .125;
			sequence			= fract(angle + sequence);
		
			if(floor(sequence * 8.) == i) 
			{
				cell.xz 			= fract(neighbor.xz-cell.w);
			}	
		}
	}
	
	for (float i = 0.; i < 8.; i++)
    	{	
		//get the neighbor cell by it's center
		vec2 offset		= neighbor_offset(float(i));
		
		vec2 neighbor_uv 	= gl_FragCoord.xy;
		neighbor_uv		/= resolution;

		neighbor_uv		= floor(neighbor_uv*scale)/scale;
		neighbor_uv		+= offset/scale + .5/scale;
		neighbor_uv		= mod(neighbor_uv, 1.-1./scale);

		
		vec4 neighbor 		= texture2D(renderbuffer, neighbor_uv);
		
		float angle 		= neighbor.w;
		
		//check to see if it's alive
		if (angle != 0.)
		{   
			//if so, rotate its angle based on the series 
			float sequence		= abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;
			sequence 		= fract(sequence) * .125;
			sequence			= fract(angle + sequence);
		
			if(floor(sequence * 8.) == i) 
			{
				//resample neighbor to gather the entire area
				neighbor_uv 		= gl_FragCoord.xy;
				neighbor_uv		/= resolution;
				neighbor_uv		+= offset/scale;
				neighbor_uv		= mod(neighbor_uv, 1.-1./scale);
				neighbor 		= texture2D(renderbuffer, neighbor_uv);
		
				cell.yw 			= fract(neighbor.yw-cell.x);
			}	
		}
	}	
	
	
	//mousey
	vec2 mouse_floor		= floor((mouse*scale))/scale;
	vec2 mouse_direction	= normalize(mouse-.5);
	float mouse_angle	= fract(atan(mouse_direction.x, mouse_direction.y)/(8.*atan(1.)));
	
	
	
	//add new cells in the center 
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	float new_angle		= fract(prior_cell.w + MIN_FLOAT);
	vec4 new_cell		= vec4(0.,0.,new_angle, mouse_angle);
	new_cell.xy		= fract(uv*scale);
//	new_cell.xyz		-= print_index(new_angle*1e3, print_uv);	

	vec2 fuv			= floor((uv)*scale)/scale;
	bool center_pixel	= fuv.x == floor(.5*scale.x)/scale.x && fuv.y == floor(.5*scale.y)/scale.y;
	cell			= center_pixel ? new_cell : cell;

	cell			= mouse.y < .925 ? cell : prior_cell;
	
	cell.xyz		= cell.w > 0. ? cell.xyz : prior_cell.xyz;
		
	
	cell			*= mouse.x > .02 && mouse.y > .02 ? 1. : 0.; //clear
	
	
	gl_FragColor = cell;
}//sphinx


//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
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
	result 		+= index < 0. ? sprite(24., position + vec2(4., 0.)) : 0.;		
	//for(int i = 0; i < 8; i++)
	for(int i = 8; i >= 0; i--)
	{
		float place = pow(10., float(i));
		if(index >= place || float(i) < 1.)
		{
			result	 	+= digit(abs(index/place), position);
			position.x 	-= 4.;
		}
	}
	return result;
}


float print_coordinates(float n, float scale, vec2 print_coordinate)
{
	print_coordinate.x	= mod(print_coordinate.x, scale);
	print_coordinate.y	= mod(print_coordinate.y, scale);
	
	return print_index(n, print_coordinate-vec2(6., 8.)/resolution*scale);	
}