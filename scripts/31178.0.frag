precision highp float;
uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

//ray automata

#define FREQUENCY 		370./32.
#define MAX_FLOAT		pow(2.,  8.)
#define MIN_FLOAT		pow(2., -8.)
#define WRAP 			true

#define VOLUME_RESOLUTION	32.

vec2 neighbor_offset(float i);	//8 offsets corrosponding to the ring of moore neighborhood positions ((0., -1.), (1., -1.), (1., 0.), (1., 1.)... etc)

void main() 
{
	vec4 cell		= vec4(0.);
	
	vec3 uvw			= vec3(0.);
	
	vec2 field		= gl_FragCoord.xy * FREQUENCY;

	vec2 offset		= floor(mouse*resolution/VOLUME_RESOLUTION)*VOLUME_RESOLUTION;
	
	vec2 fc			= mod(gl_FragCoord.xy - offset, resolution);
	vec2 extent		= abs(fc-VOLUME_RESOLUTION * .5) * 2.;
	bool bound		= extent.x < VOLUME_RESOLUTION && extent.y < VOLUME_RESOLUTION;
	
	if(bound)
	{
		for (float i = 0.; i < 8.; i++)
    		{
			vec2 neighbor_uv 	= mod(gl_FragCoord.xy - neighbor_offset(float(i)) - offset, VOLUME_RESOLUTION) + offset;
			neighbor_uv		= fract(neighbor_uv/resolution);
			vec4 neighbor 		= texture2D(renderbuffer, neighbor_uv);
		
			float angle 		= neighbor.w;
		
			if (angle != 0.)
			{   
				//rotate angle based on 
				float sequence		= abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;
				sequence 		= fract(sequence) * .125;
				sequence			= fract(angle + sequence);
		
				if(floor(sequence * 8.) == i) 
				{
					cell 		= neighbor;
				}	
			}
		}		
	}
	
	vec2 uv			= gl_FragCoord.xy/resolution;
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	
	
	float new_angle		= fract(prior_cell.w + MIN_FLOAT);
	vec4 new_cell		= vec4(1., 1., 1., new_angle);
	
	
	vec2 new_cell_pixel	= vec2(VOLUME_RESOLUTION * .5 + offset);
	bool add_new_cell	= floor(gl_FragCoord.x) == new_cell_pixel.x && floor(gl_FragCoord.y) == new_cell_pixel.y;
	cell			= add_new_cell ? new_cell : cell;
	
	//cell			= cell.w > 0. ? cell : vec4(prior_cell.xyz, 0.);
	
	cell			*= mouse.x + mouse.y > .1 ? 1. : 0.;

	gl_FragColor = cell;
}//sphinx


//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}
