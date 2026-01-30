#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;
uniform float time;

//particle automata
//25と32は、黄金比φと同じように、スパイラルによく分布しています。


#define PENT 			pow(5., 2.) 	 //25
#define OCT			pow(2., 5.)	 //32
#define PHI			(sqrt(5.)*.5+.5) //φ		
#define WRAP 			true
#define TRAILS			true

#define NEW_CELL_POSITION 	(floor(resolution*.5-.5/resolution))	//center
//#define NEW_CELL_POSITION 	floor(mouse * resolution)		//mouse position
//#define NEW_CELL_POSITION 	vec2(0., 0.)				//bottom left

//color channels with information about particles
#define ANGLE 2
#define TRAIL 1

vec2 neighbor_offset(float i);			//8 offsets corrosponding to the ring of moore neighborhood positions ((0., -1.), (1., -1.), (1., 0.), (1., 1.)... etc)
vec4 reset_button(inout vec4 cell);		//flashing button in the bottom left, mouse over it to reset
vec4 add_new_cell(inout vec4 cell);		//adds a new cell at the "new cell position"
vec4 clear_at_screen_edge(inout vec4 cell);	//clears the cells at the boundary of the screen to prevent wrapping
vec4 add_trail(inout vec4 cell);		//add trails

void main() 
{
	vec4 cell			= vec4(0., 0., 0., 0.);
	vec2 uv  			= gl_FragCoord.xy / resolution.xy;  
	//vec2 field			= mod(gl_FragCoord.xy * PHI, 1.);
	vec2 field			= mod(gl_FragCoord.xy * OCT, PENT)/PENT;
	field				/= 8.;
	
	for (float i = 0.; i < 8.; i++)
    	{
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset(i))/resolution);
		vec4 neighbor		= texture2D(renderbuffer, neighbor_uv);
		float angle		= neighbor[ANGLE];
	
		float sequence		= abs(fract(angle * 2.)-.5) < 1./4. ? field.x : field.y;
		sequence 		= mod(sequence, 1./8.);
		sequence		= fract(angle + sequence);
		
		cell 			= floor(sequence * 8.) == i ? neighbor : cell;
        }
	
	//cell 				= add_new_cell(cell);
	
	cell 				= WRAP 		? cell 			: clear_at_screen_edge(cell);
	cell 				= TRAILS	? add_trail(cell) 	: cell;
	
	
	cell 				= reset_button(cell);
	//cell.xyz*=sin(time)*.5+.5;
	gl_FragColor 			= cell;
	gl_FragColor.w			= 1.;
}//sphinx


//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}


//clears the backbuffer, resetting the automata (also draws a button)
vec4 reset_button(inout vec4 cell)
{
	float mouseover_threshold = .1;	
	return max(mouse.x, mouse.y) < mouseover_threshold ? vec4(0., 0., 0., 0.) : cell;
}


//adds a new cell at the position every frame
vec4 add_new_cell(inout vec4 cell)
{
	#ifdef NEW_CELL_POSITION 
		vec2 position 		= NEW_CELL_POSITION;
		vec2 uv			= gl_FragCoord.xy/resolution.xy; 
		bool is_center_pixel   	= floor(gl_FragCoord.x) == position.x && floor(gl_FragCoord.y) == position.y;
		float prior_angle	= texture2D(renderbuffer, uv)[ANGLE]; 
		float initial_angle	= fract(prior_angle + pow(PHI, -2.));
		vec3 color		= vec3(1.);
		cell			= is_center_pixel ? vec4(1., 1., 1., 1.) 	: cell;
    		cell[ANGLE]		= is_center_pixel ? initial_angle 		: cell[ANGLE];	
		
	#endif
	return cell;
}


//clears the cell if it reaches the screen border
vec4 clear_at_screen_edge(inout vec4 cell)
{
	return cell * float(gl_FragCoord.x > 1. && gl_FragCoord.y > 1. && gl_FragCoord.x < resolution.x-1. && gl_FragCoord.y < resolution.y-1.);
}


//leaves a trail in the color channel from the previous frame
vec4 add_trail(inout vec4 cell)
{
	vec2 uv			= gl_FragCoord.xy/resolution.xy; 
	vec4 prior		= texture2D(renderbuffer, uv);
	float opacity		= .5;
	
	cell[TRAIL]		= cell[ANGLE] != 0. ? prior[TRAIL] + opacity : prior[TRAIL];
	cell[TRAIL] *= .9;
	return cell;
}
