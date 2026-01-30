#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

void main() 
{   
   	//position offsets for the moore neighborhood
    	vec2 offset[8]; 
    	offset[0] = vec2(  0., -1. );
    	offset[1] = vec2( -1., -1. );
    	offset[2] = vec2( -1.,  0. );
	offset[3] = vec2( -1.,  1. );
	offset[4] = vec2(  0.,  1. );
	offset[5] = vec2(  1.,  1. );
	offset[6] = vec2(  1.,  0. );
	offset[7] = vec2(  1., -1. );
      	
	
	//check neighbors to see if any are angled to this current position
	vec2 uv 		= vec2(0.);
	vec4 neighbor 		= vec4(0.);
	vec4 cell 		= vec4(0.);
	vec4 trail		= vec4(0.,0.,0.,0.);
	
	
	//loop through neighbors
	for ( int i = 0; i < 8; i++ )
    	{
		//create neighbor sample position
		uv		= gl_FragCoord.xy + offset[i];
		uv		= uv / resolution;
		
		
		//sample 
		neighbor 	= texture2D(renderbuffer, uv); 
		float incidence	= neighbor.w;
		
		
		//if alive, check to see if it is approaching
        	bool is_alive	= incidence != 0.;
		if (is_alive)
		{   
			//deterimine the major axis of the incoming angle
			float half_angle 	= min(incidence, fract(incidence - .5 ));    
			bool axis		= half_angle < .125 || half_angle > .375;
			
			
			//do strange lookup function
			vec2 lookup		= floor(255. * gl_FragCoord.xy)/resolution;
	
			
			//correct for aspect ratio
		 	lookup	 		*= vec2(resolution.x/resolution.y, 1.);
			
			
			//select the proper axis of the lookup as a sample 
			float sample		= axis ? lookup.y : lookup.x;
			sample 			= mod(sample, .125);
			
					
			//add it to determine if the incoming automata should enter or not
    	        	float result		= fract(incidence + sample);  
            		
						
			//if the incoming angle is coming from the correct neighbor, accept the automata
        	    	bool approaching        = floor(result * 8.) == float( i );
			if ( approaching ) 
			{
				//set the current cell to the neighbor
				cell = neighbor;
			}
			else
			{
				trail = abs(cell-neighbor+trail);
			}
			
		}
        }
	
	

	//trail
	cell = cell.w == 0. && trail.w != 0. ? trail-.0125 : cell;
	
	
	//create new cells at the center of the screen
	vec2 center		= floor(resolution * .5);
	vec2 coord		= floor(gl_FragCoord.xy);
	bool is_center_pixel   	= coord.x == center.x && coord.y == center.y;	
	if(is_center_pixel)
	{
		float initial_angle	= fract(time*.075);	
		cell	 		= vec4(1., 1., 1., initial_angle);
	}
	
	
	
	
	
	//reset on mouse in bottom left corner
	cell *= float(mouse.x + mouse.y > .25);
	
	
	gl_FragColor = cell;
}//sphinx