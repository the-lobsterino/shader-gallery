#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

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

vec2 foldY(vec2 p, float n)
{
	float r = length(p.xy);
	float a = atan(p.y, p.x);
	float c = (4.*atan(1.)) / n;
	a = mod(a, 2.0 * c) - c; 
	p.x = r * cos(a);
	p.y = r * sin(a);
	return p;
}


float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}


float tree(vec2 p)
{
	p = p.yx;
	float t    = 0.;
	float l    = .9995;
	float wr   = .75;
	float lr   = .75;
	float w    = .02;
	float lw   = w/wr;

	float rot = .667 * mouse.y*.5+.5;
    
	float f = rot;
	float r = rot;
    
	for (int i = 0; i < 8; i++)
	{
    		float b = line(p, vec2(w, 0.), p+vec2(l, 0.), w);
	    	t       = max(t,b);
    	
		bool branch = true;//abs(p.x*.5) < abs(p.y);
            
		p     = foldY(p, f);                      
		r     = foldY(p*-r, f*.5).x;
		p.x   += l;
		l     *= lr;
		w     *= wr;
        }
	
        t = length(p)*8.;
        
	return t;
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
	float prior_error 	= 0.;
	vec2 position		= (uv*8.-4.)*resolution.xy/resolution.yy;
	float function_map	= tree(position);

	for ( int i = 0; i < 8; i++ )
    	{
		//create neighbor cell position
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i])/resolution);
		
		//get neighbor cell
		vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		float neighbor_angle 	= neighbor_cell.w;
		
        	bool is_occupied	= neighbor_angle != 0.;
		if (is_occupied)
		{   
			//sample decision function - fract(256 * x)
			//this contains the proper series of high and low values that pick if a cell should be occupied by an indirect angle across the x y cells
			//it is visualized here http://glslsandbox.com/e#21453.6
			vec2 sample_position	= floor(255.5 * gl_FragCoord.xy)/resolution;
			
			//correct for aspect ratio - a different correction is needed for fullscreen due to the altered ratio
		 	sample_position 	*= vec2(resolution.x/resolution.y, 1.);
		
			
			//deterimine the major axis of the incoming angle for the decision function
			float sample_angle 	= min(neighbor_angle, fract( neighbor_angle - .5 ));    
			bool axis		= sample_angle < .125 || sample_angle > .375;
			
			
			//grab the sample solution from the decision function and scale it to a value equivalent to the span of a neighbor pixel (1./8.)
			float sample		= axis ? sample_position.y : sample_position.x;
			sample 			= mod(sample, .125);
			
					
			//add it to determine if the incoming automata should enter or not
    	        	float probability	= fract(neighbor_angle + sample);  
            		

			//reverse
			probability = mouse.x < .5 ? fract(probability-.5) : probability;
			
			//if the incoming angle is coming from the correct neighbor, accept the automata
        	    	bool approaching        = floor(probability * 8.) == float( i );
			
			
			//in case of collision, check to see if this would win out
			float error = abs(probability - float(i) * .125);
        	    	approaching        	= approaching && prior_error < error;
			
			if ( approaching ) 
			{
				//set the current cell to the neighbor
				cell.yzw = neighbor_cell.yzw;
				prior_error = error;
				
				//mix in function as tangent to chase around the contour
				cell.w  = fract(mix(function_map, cell.w, .125));
			}
		}
        }
	
	//add new automata on empty cells
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	bool is_empty		= prior_cell.w == 0.;
    	
	//at the center of the screen
	//bool is_center_pixel   	= floor(gl_FragCoord.x) == floor(resolution.x * .5) && floor(gl_FragCoord.y) == floor(resolution.y * .5);	
	//float initial_angle	= fract(time*.075);	
	//cell	 		= is_center_pixel && is_empty ? vec4(0., 1., initial_angle, initial_angle) : cell; //center spawn

	//or random automata anywhere
	bool is_random_pixel  = hash(sin(time+uv.x*17.)-uv.y) + hash(sin(time+uv.y*31.)-uv.x) < .4;
	float random_angle	= hash(sin(time*.17) + uv.x * 31. - hash(uv.y * 17. + cos(time*.31)));
	cell	 		= is_random_pixel && is_empty ? vec4(0., 2., .1, random_angle) : cell; //center spawn
	
	//optional trails
	float trail_fade = .95;
	cell.y = cell.w != 0. ? prior_cell.y * 4. + cell.y - trail_fade + prior_cell.z : cell.y;

	
	//reset on mouse in bottom left corner
	cell *= float( mouse.x + mouse.y > .02 );
        
	//prevent wrapping
	//cell *= mask_screen_edges(1.);
	
	gl_FragColor = cell;
}//sphinx