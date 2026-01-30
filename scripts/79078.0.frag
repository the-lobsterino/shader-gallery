#ifdef GL_ES
precision highp float;
#endif
	

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;


struct automata
{
	float	angle;
	float 	collision;
	vec2	trail;
	bool 	alive;
};

	
automata	read(vec4 pixel);
vec4 		write(automata cell);
automata	add(automata cell);
vec2 		uv_to_screen(vec2 uv);
float 		vector_to_angle( vec2 v );
float 		angle_to_mouse();
float 		mask_screen_edges(float pixel_width);


#define TAU 			(8.*atan(1.)) //2 pi


#define ADD_CELLS_CENTER	false
#define ADD_CELLS_MOUSE		false
#define ADD_CELLS_RANDOM	true
#define TRAILS			false
#define WRAP			true
#define DEBUG_SEQUENCE		false


//this function contains the cell to cell lookup for every coordinate at every angle
//it converts an incoming angle represented as 0-1 
//http://en.wikipedia.org/wiki/Sturmian_word
//visualize the effect of the word size here - adjust it if the paths aren't straight
#define SEQUENCE_WORD_SIZE	(sqrt(5.)*.5+.5)*10.

float sequence(float theta, vec2 uv)
{
	float phase	= min(theta, fract(theta-.5));    
	bool axis	= phase < .125 || phase > .375;
	
	uv 		= uv_to_screen(uv);
	phase		= axis ? uv.y :  uv.x;
	
	float rotation	= mod(phase*SEQUENCE_WORD_SIZE, .125); 
	theta		= fract(theta + rotation);    
	
    	return theta;
}


void main( void ) 
{   
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	//assign prior pixel to automata struct (for handling collisions and making trails)
	automata cell 	= read(texture2D(renderbuffer, uv));
	
   	//position offsets for the moore neighborhood
    	vec2 offset[8]; 
    	offset[0] 	= vec2(  0., -1. );
    	offset[1] 	= vec2( -1., -1. );
    	offset[2] 	= vec2( -1.,  0. );
	offset[3] 	= vec2( -1.,  1. );
	offset[4] 	= vec2(  0.,  1. );
	offset[5] 	= vec2(  1.,  1. );
	offset[6] 	= vec2(  1.,  0. );
	offset[7] 	= vec2(  1., -1. );

	//loop through neighbors 
	for ( int i = 0; i < 8; i++ )
    	{
		//create offset uv
		vec2 uv_n		= (gl_FragCoord.xy - offset[i] * vec2(resolution.y/resolution.x, 1.));
		uv_n			= fract(uv_n/resolution);
		
		//get neighbor
		automata neighbor 	= read(texture2D(renderbuffer, uv_n)); 
		neighbor.alive		= neighbor.angle != 0.;
		
		//if the neighbor is alive, check to see if it aligned to this cell
		if(neighbor.alive)
		{
			//lookup sequence of steps for this angle at this position
			float theta 	= sequence(neighbor.angle, uv);

			//compare the sequenced neighbor angle to the relative neigbor position and check for alignment
			theta 		= floor(theta * 8.);
			bool aligned	= theta == float(i);

			if(aligned)
			{
				//if we have not yet accepted an incoming neighbor, accept this one and clear collisions - else store a collision
				if(!cell.alive)
				{
					cell 		= neighbor;
					cell.collision 	= 0.; 
				}
				else
				{
					//hacky collision - still working that out...
					cell.angle	= fract(cell.angle+neighbor.angle);
					cell.collision  = fract(theta+cell.angle);
				}
			}
		}
        }

	
	//resolve prior cell collisions
	if(cell.collision != 0. && cell.alive)
	{	
		cell.angle	= cell.collision;
		cell.collision	= 0.;
		cell.alive 	= true;
	}
	
	
	//add new cells
	if(!cell.alive)
	{	
		cell = add(cell);
	}	
	
	
	//trails
	if(TRAILS)
	{
		cell.trail = cell.alive ? vec2(1., 0.) : cell.trail-.005;
	}
	else
	{
		cell.trail = vec2(cell.alive, 0.);
	}
	
	
	//debug sequence function
	if(DEBUG_SEQUENCE)
	{
		cell.trail 	*= 0.;
		cell.trail.x 	+= sequence(vector_to_angle(vec2(0.)-uv_to_screen(uv)), uv);
		cell.trail.y 	+= sequence(angle_to_mouse(), uv);
		cell.trail 	= cell.alive ? vec2(1., 1.) : cell.trail - vec2(.25, 0.);
	}

	
	//write result
	vec4 result 	=  write(cell);
	
	
	//cutoff screen edges
	result 		*= mask_screen_edges(1.);
	
	
	//clear if mouse is in the bottom left corner
	result 		*= float(mouse.x+mouse.y > .1);
		
	vec2 fc = gl_FragCoord.xy;
	
	gl_FragColor 	= result; 
}//sphinx


automata read(vec4 pixel)
{
	automata cell;
	cell.trail	= pixel.yz;
	cell.collision	= pixel.x;
	cell.angle  	= pixel.w;
	return cell;
}

	
vec4 write(automata cell)
{
	vec4 result;
	result.yz 	= cell.trail;
	result.x	= cell.collision;
	result.w 	= cell.angle;

	return result;
}

	
automata add(automata cell)
{
	bool mouse_pixel 	= floor(mouse * resolution) == floor(gl_FragCoord.xy) && ADD_CELLS_MOUSE;
	bool center_pixel 	= floor(resolution *    .5) == floor(gl_FragCoord.xy) && ADD_CELLS_CENTER;
	bool random_pixel 	= fract(fract(cell.trail.y+cell.trail.x)+1e1/dot(1e-5/(1e2/(resolution*1.1+gl_FragCoord.xy-mouse)),-mouse.yx-3e1/gl_FragCoord.yx)*.025) == .5 && ADD_CELLS_RANDOM;
	
	if(center_pixel )
	{
		cell.angle		= fract(cell.angle + 1./256.);
		cell.collision		= 0.;
		cell.trail		= vec2(.05, .75);
		cell.alive 		= true;
	}
	else if(mouse_pixel)
	{
		cell.angle		= max(cell.angle, fract(1e1/dot(1e-5/(1e2/(resolution*1.1+gl_FragCoord.xy-mouse)),-mouse.yx-3e1/gl_FragCoord.yx)));
		cell.collision		= 0.;
		cell.trail		= vec2(.75, .05);
		cell.alive 		= true;
	}
	else if(random_pixel)
	{
		cell.angle		= max(cell.angle, fract(12345.678/fract(mouse.x*1234.5678/gl_FragCoord.y)+fract(1234.5678*mouse.y/gl_FragCoord.x)));
		cell.collision		= 0.;
		cell.trail		= vec2(.75, .05);
		cell.alive 		= true;
	}
	else
	{
		cell.angle = 0.;
	}
		
	return cell;
}

	
float vector_to_angle(vec2 v)
{
	return fract(atan(v.x, v.y)/TAU) ;
}

	
float angle_to_mouse()
{
	vec2 position   = uv_to_screen( gl_FragCoord.xy / resolution.xy );
	vec2 mouse_pos  = uv_to_screen( mouse );
	vec2 v          = mouse_pos - position;
	return vector_to_angle( v );
}

	
vec2 uv_to_screen(vec2 uv)
{
	uv       = uv * 2. - 1.;
	uv.x     *= resolution.x / resolution.y;
	return uv;
}

	
float mask_screen_edges( float width )
{
    return  !WRAP && (gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width) ? 0. : 1.;    
}