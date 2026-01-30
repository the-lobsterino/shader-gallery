#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;



float value_noise(in vec2 uv)
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(v*1.23456789)*9.18273645*v);
    l.zw    = l.zw*l.zw*(3.-2.*l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}


float fbm(float a, float f, vec2 uv, const int it)
{
    float n = 0.;
    vec2 p = vec2(.0, -.29);
    float pn = 0.;
    for(int i = 0; i < 32; i++)
    {
        if(i<it)
        {
            n += value_noise(uv*f+p)*a;
            a *= .5;
            f *= 2.;
        }
        else
        {
            break;
        }
    }
    return n;
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float mask_screen_edges( float width )
{
    return  gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width ? 0. : 1.;    
}

vec2 format_to_screen(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	return uv;
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
      
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	float celerity 		= prior_cell.z;
	
	//check neighbors to see if any are angled to this current position
	vec4 cell = vec4( 0. );
		
	for ( int i = 0; i < 8; i++ )
    	{
		//create neighbor cell position
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i] * (1.+celerity*8.))/resolution);
		
		
		//get neighbor cell
		vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		float neighbor_angle 	= neighbor_cell.w;
		
		
        	bool is_occupied	= neighbor_angle != 0.;
		if (is_occupied)
		{   
			//sample decision function - fract(256 * x)
			//this contains the proper series of high and low values that pick if a cell should be occupied by an indirect angle across the x y cells
			//it is visualized here http://glslsandbox.com/e#21453.6
			vec2 sample_position	= (255.5 * gl_FragCoord.xy)/resolution-.5/resolution;
			
			//correct for aspect ratio - a different correction is needed for fullscreen due to the altered ratio
		 	sample_position 	*= vec2(resolution.x/resolution.y, 1.);
		
			
			//deterimine the major axis of the incoming angle for the decision function
			float sample_angle 	= min(neighbor_angle, fract( neighbor_angle + .5 ));    
			bool axis		= sample_angle < .125 || sample_angle > .375;
			
			
			//grab the sample solution from the decision function and scale it to a value equivalent to the span of a neighbor pixel (1./8.)
			float sample		= axis ? sample_position.y : sample_position.x;
			sample 			= mod(sample, .125);
			
			
			//add it to determine if the incoming automata should enter or not
    	        	float probability	= fract(neighbor_angle + sample);  
            		
			
			//if the incoming angle is coming from the correct neighbor, accept the automata
        	    	bool approaching        = floor(probability * 8.) == float( i );
			if ( approaching || neighbor_uv == uv) 
			{
				//set the current cell to the neighbor
				cell = neighbor_cell;
				break;
			}
		}
        }

	//add new automata at the center of the screen
	
    	bool is_center_pixel   	= floor(gl_FragCoord.x) == floor(resolution.x * .5) && floor(gl_FragCoord.y) == floor(resolution.y * .5);
	bool is_empty		= prior_cell.w == 0.;
	float initial_angle	= fract(time*.1);	
	vec3 initial_color	= vec3(1.,1.,1.);
    	cell	 		= is_center_pixel && is_empty ? vec4(initial_color, initial_angle) : cell;
	
	//optional trails
	float trail_fade	= 1.;
	cell.xyz 		= cell.w == 0. ? prior_cell.xyz + cell.xyz * cell.w  - trail_fade : cell.xyz;
	

	celerity = max(fbm(.5, 2., format_to_screen(uv+time*.0125), 5)*2.-.5, .05);
	cell.z = cell.w == 0. ? max(0., celerity) : cell.z;
	cell.z = mix(celerity, prior_cell.z, .5);

	
	
	//reset on mouse in bottom left corner
	cell *= float( mouse.x + mouse.y > .02 );
        
	//prevent wrapping
	//cell *= mask_screen_edges(1.);
	
	gl_FragColor = cell + vec4(3.,1.5,0.,1.)*fract(uv.x*1234.5678+fract(uv.y*5678.1234)/uv.x)*.01;
}//sphinx