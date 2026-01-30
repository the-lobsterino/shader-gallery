#ifdef GL_ES
precision highp float;
#endif

//Isotropic Automata by Chris Birke - Unbound Technologies Inc.
//
//Licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
//Based on a work at http://glslsandbox.com/e#21210.1
//Email with questions, improvements, and curiosity - cbirke@gmail.com

//11.16.26 - simplified version
//the decision function is visualized here : http://glslsandbox.com/e#21453.3

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;


void main() 
{   
	//normalized screen coordinate
	vec2 uv  = gl_FragCoord.xy / resolution.xy;  
	
	#define time time*0.17
	
    	//an array of position offsets for the moore neighborhood
	//8 pixels around the current one, starting at the bottom and looping round to the top counter clockwise
    	vec2 neighbor_offset[8]; 
	float stepDelta = 3.;
	neighbor_offset[6] = vec2(  stepDelta,  0. );
    	neighbor_offset[2] = vec2( -stepDelta,  0. );
	neighbor_offset[4] = vec2(  0.,  stepDelta );
    	neighbor_offset[0] = vec2(  0., -stepDelta );
	neighbor_offset[5] = vec2(  stepDelta,  stepDelta );
	neighbor_offset[7] = vec2(  stepDelta, -stepDelta );
	neighbor_offset[3] = vec2( -stepDelta,  stepDelta );
    	neighbor_offset[1] = vec2( -stepDelta, -stepDelta );
      
	
	//check neighbors to see if any are angled to this current position
	vec4 cell = vec4( 0. );
	for ( int i = 0; i < 8; i++ )
    	{
		//create neighbor cell position
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i])/resolution);
		
		//get neighbor cell
		vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		float neighbor_angle 	= neighbor_cell.w;
		
        		bool is_occupied		= neighbor_angle != 0.;
		if (is_occupied)
		{   
			//sample decision function - fract(256 * x)
			//this contains the proper series of high and low values that pick if a cell should be occupied by an indirect angle across the x y cells
			//it is visualized here http://glslsandbox.com/e#21453.3
			vec2 sample_position	= (255. * gl_FragCoord.xy)/resolution-.5/resolution;
			
			//correct for aspect ratio - a different correction is needed for fullscreen due to the altered ratio
			sample_position 		*= vec2(resolution.x/resolution.y, 1.);
		
			
			float sample_angle 	= min(neighbor_angle, fract( neighbor_angle + .5 ));    
        			bool axis	        = sample_angle < .125 || sample_angle > .375;
			
			//grab the sample solution from the decision function
			float sample					= axis ? sample_position.y : sample_position.x;
			sample 					= fract(sample)*.125;
			
			//add it to pick between the two possible neighbor cells that the angle might enter
    	        	float probability	= fract(neighbor_angle + sample);  
            		
        	    		bool approaching        = floor(probability * 8.) == float( i );
                     
			if ( approaching ) 
			{
				cell = neighbor_cell;
				break;
			}
		}
        	}

	//add new automata at the center of the screen
    	bool is_center_pixel   	= floor(gl_FragCoord.x) == floor(resolution.x * .5) && floor(gl_FragCoord.y) == floor(resolution.y * .5);
	bool is_empty		= cell.w == 0.;
	float initial_angle	= fract(time*time*time*.025);	
    	cell	 			+= is_center_pixel && is_empty ? vec4(1., 1., 1., initial_angle) : vec4(0.);
	
	//optional trails
	//float trail_fade 	= .005;
	//float prior_cell	= texture2D(renderbuffer, uv).x-trail_fade;
	//cell.xyz += prior_cell;
	
	//reset on mouse in corner
	cell *= float( mouse.x + mouse.y > .02 );
        
	gl_FragColor = cell;
}//sphinx