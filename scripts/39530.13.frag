precision highp float;

//integer path automata
//living cells are represented by an angle in the 8 bit alpha channel
//gpu hardware would prefer floating point formats, but I've made this version as a demonstration


//no time input, only prior state and coordinates
uniform sampler2D renderbuffer;
uniform vec2      resolution;
uniform vec2 	  mouse;


//automata functions
vec2 neighbor_offset(float i);	
void insert_new_angle(inout int angle);
bool mouse_at_screen_edge();


//integer ops aren't fully supported in this version of webgl (gpu's prefer floats) and thus these overrides are necessary
int abs(int i);
int mod(int i, int m);
ivec2 mod(ivec2 i, int m);


void main() 
{	
	//this low discrepency sequences evenly distributes the series of choices that create the paths
	//http://glslsandbox.com/e#39529.0 < plot of sequence
	//not sure if 5^2 is optimal, other small primes (13) squared also do well as the multiplier 
	ivec2 address		= ivec2(gl_FragCoord.xy);
	ivec2 sequence 		= mod(address * 25, 32);	

	
	//8 surrounding pixels from memory are sampled to decide whether to accept an incoming angle traveling along it's path
	int angle		= 0;
	for (int i = 0; i < 8; i++)
    	{
		//sample the 8 surrounding neighbors of this address - note : subtracting neighbor_offset from the address reverses the motion*
		vec2 neighbor_offset	= neighbor_offset(float(i+1));
		vec2 neighbor_address	= vec2(address) + neighbor_offset;
		//neighbor_address	= mod(neighbor_address, resolution);

		vec4 sample		= texture2D(renderbuffer, neighbor_address/resolution);
		

		//the incoming angle is stored as an normalized 8 bit float (0. - 1.) in the w alpha channel of the last frame buffer
		//these "angles" are equivalent to the result of (atan2(x,y)+PI)/(2*PI) from the euclidean vector form
		//here it is converted to an int and put into the 0-512 range 
		int incoming_angle	= int(sample.w * 512.);
		
		//the sequence must get a new value at each step, so we must identify the primary axis of motion or the angle		
		bool axis		= abs(mod(incoming_angle * 2, 256) - 128) <= 64;	
		
		//this value from the sequence will determine whether the angle is directed into this address at this step
		//note : here I use an uncommon definition of the term "determinant"
		int determinant		= !axis ? sequence.x : sequence.y;	
			
		
		//compare the current sequence alignment to the direction of the current neighbor sample
		int angle_alignment	= mod(incoming_angle + determinant, 256) * 2 - 31;
		int angle_to_sample	= i * 64;		
		int difference		= abs(angle_to_sample - angle_alignment);		

		
		//induct this angle if the difference is less than half the octant
		angle			= difference <= 32 ? incoming_angle : angle;
	}	
	

	insert_new_angle(angle);


	//convert the new_angle back to normalized floating point range and output it to the w channel
	gl_FragColor.w 		= float(angle)/512.;
	
	
	//add color where the angle isnt 0 so we can see it	
	gl_FragColor.xyz	= vec3(angle != 0);
	//gl_FragColor.xyz	= max(texture2D(renderbuffer, gl_FragCoord.xy/resolution).xyz, gl_FragColor.xyz); //draw paths
	
	//clear the buffer if the mouse is in the corner
	gl_FragColor		*= mouse_at_screen_edge() ? 0. : 1.;
}//sphinx



//returns the offsets for the neighboring cells in the neighborhood around a square spiral - (0., 0.), (1., 0.), (1., 1.), (0., 1.)... (inverse ulam spiral)
//http://glslsandbox.com/e#39623.0 < plotted along with the forward transform - another function would serve just as well here
vec2 neighbor_offset(float i)
{
	float r	= sqrt(i+.5);
	float s = 3. - fract(r) * 4.;	
	r	*= mod(r, 2.) > 1. ? .5 : -.5;	
	return ceil(s > 1. ? vec2(r, 2. * r - r * s) : vec2(r * s, r));
}



//adds new cells
void insert_new_angle(inout int angle)
{
	int prior_angle		= int(texture2D(renderbuffer, gl_FragCoord.xy/resolution).w * 512.); 
	
	bool insert		= length(floor(gl_FragCoord.xy - resolution * .5)) < 1.;  		//emit cells from the center pixel
//	bool insert		= length(floor(gl_FragCoord.xy - resolution * mouse)) < 1.;  		//emit cells from the mouse pixel
	
	int new_angle		= mod(prior_angle + 400, 512); 						//evenly distributed angle progression
//	int new_angle		= mod(prior_angle - 255, 512); 						//linear angle progression
	new_angle		= new_angle - 1 < 0 ? 512 : new_angle;
	
	angle	 		= insert ? new_angle : angle;
}



bool mouse_at_screen_edge()
{	
	float area = .05;
	bool x = abs(mouse.x-.5) > .5-area;
	bool y = abs(mouse.y-.5) > .5-area;
	return x && y;
}


int abs(int i)			
{ 
	return i >= 0 ? i : -i; 
}


int mod(int i, int m)		
{ 
	return int(mod(float(i), float(m))); 
}


ivec2 mod(ivec2 i, int m)	
{ 
	return ivec2(mod(vec2(i), vec2(m))); 
}
