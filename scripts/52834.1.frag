precision highp float;

uniform sampler2D renderbuffer;
uniform vec2      resolution;
uniform vec2 	  mouse;
uniform float time;



//options
#define TRAILS 		true
#define COLOR 		true
#define WRAP 		true
#define ADD_CELLS	true



//channel definitions to map the data and colors to the pixel.rgba in a more legible way - 0=(red), 1=(green), 2=(blue) 
//the channels not carrying the angle are given colors if the COLOR define is true - they are purely decorative
#define ANGLE 		2
#define COLOR_MASK	vec4(ANGLE != 2, ANGLE != 2, ANGLE != 2, ANGLE != 3)


//the buffer is set to be cleared if the mouse is on the far left of the screen
#define CLEAR_BUFFER	false	


//header
vec2 neighbor_offset(float i);	

void main() 
{	
	//create the field for deciding the proper angle procession from the screen coordinates
	vec2 coordinates		= gl_FragCoord.xy;	
	vec2 field 			= mod(coordinates * 32., 25.)/25./8.;	
	
	
	//process local neighbors for incoming angles
	float neighbor_angle		= 0.;
	float sequence			= 0.;
	float moment			= 0.;
	bool major_axis			= false;
	bool aligned			= false;
	vec4 pixel			= vec4(0., 0., 0., 0.);	
	for (float i = 0.; i < 8.; i++)
    	{
		vec2 neighbor_uv 	= gl_FragCoord.xy + neighbor_offset(i);					//create neighbor sample position
		neighbor_uv		= neighbor_uv/resolution;						//normalize for sampling 
		neighbor_uv		= WRAP ? fract(neighbor_uv) : neighbor_uv;				//wrap around edges
		
		
		neighbor_angle 		= texture2D(renderbuffer, neighbor_uv)[ANGLE];				//read in neighbor_angle
		
		
		major_axis		= abs(fract(neighbor_angle * 2.) - .5) < .25;				//determine its major axis of motion
		sequence		= major_axis ? field.x : field.y;					//use it to select the corrosponding sequence from the field
		moment			= fract(neighbor_angle + sequence);					//combine it with the neighbor angle to create the angle at this specific moment 
		
		
		aligned			= floor(moment * 8.) == i;						//compare neighbor angle alignment against neighbor index to decide if to accept it
		if(aligned)
		{
			pixel[ANGLE]	= neighbor_angle;							//write out the new angle if it is aligned
		}
	}	
	
	
	
	
	
	
	//add new cells to the center pixel
	if(ADD_CELLS)
	{	
		vec4 prior_pixel		= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
		bool center_pixel	= length(floor(gl_FragCoord.xy - resolution * .5)) == 0.;		//test to see if this is the center pixel
		if(center_pixel)
		{
			pixel[ANGLE]	= fract(prior_pixel[ANGLE] + 25./16.);					//create a new angle from the prior pixel if it is
		}
	}
	gl_FragColor[ANGLE]		= pixel[ANGLE];		

	
	
	
	
	
	
	//everything past this point is just for visualization
	if(TRAILS)												//add trails
	{
		vec4 prior_pixel	= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
		float opacity		= .975;
		pixel			= pixel * (1. - COLOR_MASK) + max(pixel, prior_pixel * opacity) * COLOR_MASK;
	}
	
	
	if(COLOR)												//add color to the other channels if the pixel is alive
	{
		float alive		= float(pixel[ANGLE] != 0.);
		vec4 color		= fract(vec4(pixel[ANGLE], -pixel[ANGLE], pixel[ANGLE], pixel[ANGLE])) * alive;
		pixel			+= color * COLOR_MASK;							
	}
	
	
	if(CLEAR_BUFFER)
	{
		pixel			*= 0.;
	}
	
	
	
	gl_FragColor			= pixel;	
	gl_FragColor[ANGLE]		= pixel[ANGLE];									
	gl_FragColor.w			= 1.;									//web gl demands the alpha channel now be non zero	
}//sphinx


//returns a vector to one of 8 moore neighborhood directions in a ring around the center sample (gpu friendly)
//{ vec2(0., -1.), vec2(-1., -1.), vec2(-1., 0.), vec2(-1., 1.), vec2(0., 1.), vec2(1., 1.), vec2(1., 0.), vec2(1., -1.) };
vec2 neighbor_offset(float i) 
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}