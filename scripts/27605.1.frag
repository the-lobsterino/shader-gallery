#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

#define BRANCHING_PATTERN vec2(.125, .05)

#define FREQUENCY 		84.9
#define TRAILS 			true			
#define WRAP 			false
#define NEW_CELL_POSITION 	floor(resolution*.5)
//#define NEW_CELL_POSITION 	floor(mouse * resolution)


vec2 neighbor_offset(float i);			//8 offsets corrosponding to the ring of moore neighborhood positions ((0., -1.), (1., -1.), (1., 0.), (1., 1.)... etc)
vec4 reset_button(inout vec4 cell);		//flashing button in the bottom left, mouse over it to reset
vec4 add_trail(inout vec4 cell);		//add trails
vec4 add_new_cell(inout vec4 cell, in vec2 uv);	//adds a new cell at the "new cell position"
vec4 clear_at_screen_edge(inout vec4 cell);	//clears the cells at the boundary of the screen to prevent wrapping


void main() 
{
	vec4 cell		= vec4(0.);
	vec2 uv  		= gl_FragCoord.xy / resolution.xy;  
	vec2 position		= uv * vec2(resolution.x/resolution.y, 1.);	
	

	for (int i = 0; i < 8; i++)
    	{
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset(float(i)))/resolution);
		vec4 neighbor 		= texture2D(renderbuffer, neighbor_uv);
		float angle		= neighbor.w;
		if (angle != 0.)
		{   
			float sequence		= abs(fract(angle * 2.)-.5) < .25 ? position.x : position.y;
			sequence 		= mod(sequence * FREQUENCY, .125);
			sequence		= fract(angle + sequence);
			if (int(sequence * 8.) == i) 
			{
				cell = neighbor;
				break;
			}
		}
        }
	
	
	vec4 prior	= texture2D(renderbuffer, uv);
	
	
	if(cell.w != 0.)
	{
		bool bounce 	= prior.y > 0.;
		bool turn 	= mod(floor(cell.x * 256.), floor(cell.y * 256.)) == 0.;
			
		cell.w 		= turn ? fract(cell.w + cell.z) 		: cell.w;
		cell.w 		= bounce ? fract(cell.w + .25) 			: cell.w;
		cell.z		= turn || bounce ? abs(cell.z + .25) 		: cell.z;
		cell.x 		= fract(cell.x + 1./256.);	
	}
	else if(prior.x != 0. && mod(floor(prior.x * 256.), floor(prior.y * 256.)) == 0.)
	{
		cell = vec4(fract(prior.x-cell.y), BRANCHING_PATTERN, fract(prior.w - prior.z));
		cell.x 		= fract(cell.x + 1./256.);
	}
	


	
	cell = add_new_cell(cell, NEW_CELL_POSITION);
	cell = TRAILS ? add_trail(cell) : cell;
	cell = WRAP ? cell : clear_at_screen_edge(cell);
	cell = reset_button(cell);
		
	
	gl_FragColor = cell;
}//sphinx



vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}



vec4 reset_button(inout vec4 cell)
{
	float button_size = resolution.x/256.;
	if(gl_FragCoord.x < button_size && gl_FragCoord.y < button_size)
	{
	//	vec2 uv		= gl_FragCoord.xy/resolution.xy; 
	//	vec3 prior 	= min((fract(texture2D(renderbuffer, uv).xyz+.9975)),.5);
	//	return vec4(prior, cell.w);
        }
	return cell *= float( mouse.x * resolution.x > button_size && mouse.y * resolution.y > button_size);
}



vec4 add_trail(inout vec4 cell)
{
	vec2 uv			= gl_FragCoord.xy/resolution.xy; 
	vec4 prior		= texture2D(renderbuffer, uv);
	cell.y 			+= prior.y;
	return cell;
}



vec4 add_new_cell(inout vec4 cell, in vec2 position)
{
	vec2 uv			= gl_FragCoord.xy/resolution.xy; 
	bool is_center_pixel   	= floor(gl_FragCoord.x) == position.x && floor(gl_FragCoord.y) == position.y;
	vec4 prior	= texture2D(renderbuffer, uv); 
	float initial_angle	= fract(.99999);
    	cell 			= is_center_pixel && length(prior) == 0. && mouse.x > .5 ? vec4(1., BRANCHING_PATTERN, initial_angle) : cell;	
	return cell;
}



vec4 clear_at_screen_edge(inout vec4 cell)
{
	return cell * float(gl_FragCoord.x > 1. && gl_FragCoord.y > 1. && gl_FragCoord.x < resolution.x-1. && gl_FragCoord.y < resolution.y-1.);
}