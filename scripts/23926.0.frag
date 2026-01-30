#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

//working on energy conservation under collisions - spawning them when they collide, but trying to avoid a runaway reaction
//fixes welcome...

#define TAU (8.*atan(1.))

float hash(float v)
{
	return fract(fract(v*1234.5678)*(v+v)*12345.678);
}

float mask_screen_edges( float width )
{
    return  gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width ? 0. : 1.;    
}

float reflect_angle(float incident, float normal)
{
	return fract(abs(normal)*2.-incident-.5);
}

vec2 format_to_screen( vec2 p )
{
	p       = p * 2. - 1.;
	p.x     *= resolution.x / resolution.y;
	return p;
}


//clamps to +-1./256. for the 8 bit buffer
float clamp_angle(float angle)
{
	return clamp(angle, .00390625, 1.);    
}

//maps a normalized 2d vector to a 0-1 float on a radial gradient
float vector_to_angle( vec2 v )
{
	return fract( atan( v.x, v.y ) / TAU ) ;
}


vec2 angle_to_vector(float a)
{
	vec2 v = vec2(a, a) * TAU;
	return normalize(vec2(cos(v.x),sin(v.y))).yx;
}


//mix two angles without having the problem of flipping back and forth near the 0-1 boundary - can be refactored to something better
float mix_angle( float angle, float target, float rate )
{    
	angle = abs( angle - target - 1. ) < abs( angle + target ) ? angle - 1. : angle;
	angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
	return clamp_angle(fract(mix(angle, target, rate)));
}


//returns a normalized vector from the current screen pixel to the mouse position
float angle_to_mouse()
{
	vec2 position   = format_to_screen( gl_FragCoord.xy / resolution.xy );
	vec2 mouse_pos  = format_to_screen( mouse );
	vec2 v          = mouse_pos - position;
	return vector_to_angle( v );
}

vec3 hsv(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void main() 
{   
	//normalized screen coordinate
	vec2 uv  = gl_FragCoord.xy / resolution.xy;  
	
   	//an array of position offsets for the moore neighborhood
	//8 pixels around the current one, starting at the bottom and looping round to the top counter clockwise
    	vec2 neighbor_offset[8]; 
    	neighbor_offset[0] = vec2(  0., -1. );
    	neighbor_offset[1] = vec2( -1., -1. );
    	neighbor_offset[2] = vec2( -1.,  0. );
	neighbor_offset[3] = vec2( -1.,  1. );
	neighbor_offset[4] = vec2(  0.,  1. );
	neighbor_offset[5] = vec2(  1.,  1. );
	neighbor_offset[6] = vec2(  1.,  0. );
	neighbor_offset[7] = vec2(  1., -1. );
      
	//check neighbors to see if any are angled to this current position
	vec4 cell 		= vec4( 0. );

	//access prior info
	vec4 prior_cell			= texture2D(renderbuffer, uv);
	float prior_error 		= 0.;
	float prior_collision	 	= prior_cell.x;
	float neighbor_collision 	= prior_cell.x;
	
	
	
	float velocity_field 	= 1.+(prior_cell.x-prior_cell.z)*2.;
	
	float mouse_range = length(format_to_screen(uv)-format_to_screen(mouse));
	velocity_field += float(length(mouse_range)<.5)/mouse_range*.15;
	float neighbor_field	= 0.;
	
	for ( int i = 0; i < 8; i++ )
    	{
		//laplatian kernel (for smoothing)
		//float weight 	= mod(float(i), 2.) == 0. ? .2 : .05;
		
		//apply velocity
		neighbor_offset[i] *= velocity_field;
		
		//create neighbor cell sample position
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i])/resolution);
		
		//get neighbor cell
		vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		float neighbor_angle 	= neighbor_cell.w;
		
        	bool is_occupied	= neighbor_angle != 0.;
		if (is_occupied)
		{   
			neighbor_field += neighbor_cell.y;
			
			//sample decision function - fract(256 * x)
			//this contains the proper series of high and low values that pick if a cell should be occupied by an indirect angle across the x y cells
			//it is visualized here http://glslsandbox.com/e#21453.6
			vec2 sample_position	= floor(256. * gl_FragCoord.xy)/resolution;
			
			
			//correct for aspect ratio - a different correction is needed for fullscreen due to the altered ratio
		 	sample_position 	*= vec2(resolution.x/resolution.y, 1.);
		
			
			//deterimine the major axis of the incoming angle for the decision function
			float sample_angle 	= min(neighbor_angle, fract( neighbor_angle - .5 ));    
			bool axis		= sample_angle <= .125 || sample_angle > .375;
			
			
			//grab the sample solution from the decision function and scale it to a value equivalent to the span of a neighbor pixel (1./8.)
			float sample		= axis ? sample_position.y  + .00390625 : sample_position.x;
			sample 			= fract(sample*8.)*.125;
			
					
			//add it to determine if the incoming automata should enter or not
    	        	float probability	= fract(neighbor_angle+sample);  
            		
			
			//reverse direction
			//probability = fract(time*.025) < .5 ? fract(probability-.5) : probability;
			
			
			//if the incoming angle is coming from the correct neighbor, accept the automata
        	    	bool approaching        = floor(probability * 8.) == float(i);
			
			
			//record any collision in red channel	
			cell.x = cell.w != 0. && approaching ? cell.w : cell.x; 
			neighbor_collision = prior_collision == 0. && neighbor_cell.x > 0. ? neighbor_cell.x : neighbor_collision;
			
			
			//in case of collision, check to see if this would win out
			float error = abs(probability - float(i) * .125);
        	    	approaching = approaching && prior_error < error;
        	    	approaching = approaching && neighbor_field >= neighbor_cell.y;			
			
			if ( approaching ) 
			{
				//set the current cell to the neighbor
				cell.yzw = neighbor_cell.yzw;
			
				prior_error = error;
				
				//collision handling - bounce if a collision was nearby
				cell = prior_collision != 0. && prior_cell.y < neighbor_cell.y ? vec4(prior_cell.x, cell.y, cell.w, reflect_angle(cell.w,neighbor_collision)) : cell;
			}
		}
        }

	
	
	//more collision stuff
	cell = cell.z != 0. ? vec4(0., cell.y+.1, cell.w, 0.) : cell;
	cell = neighbor_collision != 0. && cell.z == 0. ? vec4(cell.z, neighbor_field, cell.x, 1.-reflect_angle(cell.x,neighbor_collision)) : cell;
	cell.y -= .225;
	
	
	////chase mouse
	if(cell.w != 0.)
	{
		cell.w = mix_angle(cell.w, mix_angle(cell.w, angle_to_mouse(), .125), .125);
	}
    	
	
	
	////add new automata on empty cells
	bool is_empty		= prior_cell.w == 0.;
    	
	//at the center of the screen
	bool is_center_pixel   	= floor(gl_FragCoord.x) == floor(resolution.x * .5) && floor(gl_FragCoord.y) == floor(resolution.y * .5);	
	float initial_angle	= fract(time*.075);	
	cell	 		= is_center_pixel && is_empty ? vec4(0., .51, 0., initial_angle) : cell; //center spawn

	//or random automata anywhere
	bool is_random_pixel  	= hash(sin(time+uv.x*17.)-uv.y) + hash(sin(time+uv.y*31.)-uv.x) < .05;
	float random_angle	= hash(sin(time*.17) + uv.x * 31. - hash(uv.y * 17. + cos(time*.31)));
	//cell	 		= is_random_pixel && is_empty ? vec4(0., 1., random_angle, random_angle) : cell; //center spawn
	////
	
	
	
	
	////formatting
	//trails
	//cell.y = prior_cell.w == 0. && cell.w != 0. ? cell.y : prior_cell.y - .0125;
	
	////reset on mouse in bottom left corner
	cell *= float( mouse.x + mouse.y > .02 );
	
	/////prevent wrapping
	//cell *= mask_screen_edges(1.);
	
	
	
	gl_FragColor = cell;
}//sphinx