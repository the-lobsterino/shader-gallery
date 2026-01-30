precision lowp float;

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

vec2 neighbor_offset(float i);	

void main() 
{				
	vec2 field		= gl_FragCoord.xy * 7./32.;
	field			= fract(field) * 1./8.;							//this field interlaces the paths and angles
	
	vec4 cell		= vec4(0.);
	for (float i = 0.; i < 1234.; i++)
    	{
		vec2 neighbor_uv	= fract((gl_FragCoord.xy + neighbor_offset(i))/resolution);	//wrapped moore neighborhood (+- offset to reverse)
		
		float angle 		= texture2D(renderbuffer, neighbor_uv).w;			//neighbor sample
		float sequence		= abs(fract(angle * 2.) - 1./2.) <= 1./4. ? field.x : field.y;	//motion axis 
			
		cell.w 			= floor(fract(angle + sequence) * 8.) == i ? angle : cell.w; 	//resulting cell
	}	

	vec4 prior_cell		= texture2D(renderbuffer, gl_FragCoord.xy/resolution);			
	
	bool center_pixel	= length(floor(gl_FragCoord.xy - resolution * .5)) < 1.;
	float new_angle		= fract(prior_cell.w + 1./256.);
	cell.w			= center_pixel ? new_angle  : cell.w; 					//add new cell

	cell.xyz		+= float(cell.w > 0.); 							//color
//	cell.xyz		+= prior_cell.xyz * .985; 						//trails
	cell			*= float(mouse.x > .1);							//clear the screen if mouse.x < .1
	
	gl_FragColor 		= cell;
}//sphinx


vec2 neighbor_offset(float i)
{
	float c 		= abs(i-2.);
	float s 		= abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}
