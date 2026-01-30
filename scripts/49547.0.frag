precision highp float;
uniform float 	  time;
uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;


//pilot wave automata
//mouse to the left side of the screen to spawn cells


#define FREQUENCY 		32./25.
#define MAX_FLOAT		pow(2.,  8.)
#define MIN_FLOAT		pow(2., -8.)
#define WRAP 			true
#define ADD_MOUSE_CELLS		true
#define MOUSE_INFLUENCE		true
vec2 neighbor_offset(float i);						//8 offsets corrosponding to the ring of moore neighborhood positions ((0., -1.), (1., -1.), (1., 0.), (1., 1.)... etc)
vec4 reset_button(inout vec4 cell);					//flashing button in the bottom left, mouse over it to reset
vec4 clear_at_screen_edge(inout vec4 cell);	

			      
			      f
				      xcvzx dbsdbdfbrsb
				      
				      
				      dfb
				      dbdfh
				      rtb
				      tr
				      hrtbgfbsktr6
				      k
				      k
				      k
				      k
				      k
				      k
				      k
				      r6uk567um
				      > 0. ?               negative_angle : flow.y;
		flow.y			= negative_angle > 0. ? mix_angle(negative_angle, flow.y, viscosity) : flow.y;
		if (negative_angle != 0.)
		{   
			count			+= 1.;
			float sequence		= abs(fract(negative_angle * 2.) - .5) < .25 ? field.x : field.y;
			sequence 		= fract(sequence) * .125;
			sequence			= fract(negative_angle + sequence);
		
			if(floor(sequence * 8.) == float(i)) 
			{
				cell.y 		= negative_angle;
				cell.z 		= neighbor[i].z;
			}	
		}
        }
	
	vec4 d_x 	= (neighbor[5] + neighbor[6] + neighbor[7]) - (neighbor[1] + neighbor[2] + neighbor[3]); //left right
	vec4 d_y 	= (neighbor[3] + neighbor[4] + neighbor[6]) - (neighbor[1] + neighbor[0] + neighbor[7]); //top bottom

	vec2 advection	= normalize(vec2(d_x.x+d_x.z, d_y.x+d_y.z));
	float pressure	= length(abs(vec2(d_x.x+d_x.z, d_y.x+d_y.z)));
	

	for (int i = 0; i < 8; i++)
    	{
		float t 		= mod(float(i), 2.) == 1. ? 1. : sqrt(2.);
		vec2 neighbor_uv 	= gl_FragCoord.xy + neighbor_offset(float(i)) - advection * pressure * t;
		neighbor_uv		= fract(neighbor_uv/resolution);

		neighbor[i] 		= texture2D(renderbuffer, neighbor_uv);
		
		sum			+= neighbor[i] * .125;

	}
	
	if(mouse.x < .05)
	{
		cell			= add_new_cells(cell, floor(resolution * vec2(1.-mouse)));	
	}

	if(mouse.x < 1. - .125 && ADD_MOUSE_CELLS)
	{
		cell			= add_new_cell(cell, floor(resolution * vec2(mouse)), false);
		cell			= add_new_cell(cell, floor(resolution * vec2(1.-mouse)), true);
	}
	
	float normal 		= fract(atan(d_x.x+d_x.z, d_y.x+d_y.z)*.15915494);
	float positive_normal 	= fract(atan(d_x.x, d_y.x)*.15915494);
	float negative_normal 	= fract(atan(d_x.z, d_y.z)*.15915494);
	
	vec2 f			= normalize(sum.xz);
	float positive_field 	= abs(f.x-cell.x);
	float negative_field 	= abs(f.y-cell.z);
	
	float positive_angle 	= cell.w;
	float negative_angle 	= cell.y;

	float emission		= 1.;
	vec2 slope		= (1./(9.-count))/sqrt(sum.xx-prior.zz);
	float decay		= length(1.-abs(sum.xx-prior.zz))/(64.+64.*count);
	
	bool positive_charge	= cell.w > 0.;
	bool negative_charge	= cell.y > 0.;
	
	
	if(count > 3.)
	{
		float temp	= positive_angle;
		positive_angle	= negative_angle; 
		negative_angle	= temp; 	
	}	

	//fields that curve particle paths - red is positive, blue is negative
	
	//existing particles emit - empty space average charge in local neighborhood
	positive_field 		= positive_charge ? emission : mix(sum.x, mix(sum.x, prior.x, .25), slope.x) - decay; 
	negative_field 		= negative_charge ? emission : mix(sum.z, mix(sum.z, prior.z, .25), slope.y) - decay; 
	
	positive_angle 		= positive_charge && negative_field > 0. ? mix_angle(positive_angle, negative_normal, slope.y) : cell.w;
	negative_angle 		= negative_charge && positive_field > 0. ? mix_angle(negative_angle, positive_normal, slope.x) : cell.y; 
	
		
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 position		= (gl_FragCoord.xy/resolution-.5) * aspect;
	vec2 mouse		= (mouse-.5) * aspect;
	vec2 to_mouse		= normalize(position-mouse);		
	float mouse_angle	= fract(atan(to_mouse.x, to_mouse.y)*.15915494);
	
	//prior angle blend
	positive_angle		= positive_charge && prior.w != 0. ? mix_angle(positive_angle, prior.w, positive_field) : positive_angle;
	negative_angle		= negative_charge && prior.y != 0. ? mix_angle(negative_angle, prior.y, negative_field) : negative_angle;
	
	//accumulated angle blend
	if(flow.x > 0.)
	{	
		flow.x			= positive_charge && prior.w != 0. ? mix_angle(flow.x, prior.w, negative_field) : flow.x;
		positive_angle		= positive_charge ? mix_angle(positive_angle, flow.x, negative_field) : positive_angle;
	}
	
	if(flow.y > 0.)
	{
		flow.y			= negative_charge && prior.y != 0. ? mix_angle(flow.y, prior.y, positive_field) : flow.y;
		negative_angle		= negative_charge ? mix_angle(negative_angle, flow.y, positive_field) : negative_angle;
	}
	
	//mouse influence
	if(length(position-mouse) < .125 && MOUSE_INFLUENCE)
	{
		float force		= sqrt(length(position-mouse));
		negative_angle		= negative_charge ? mix_angle(negative_angle, mouse_angle, force) : negative_angle;
		positive_angle		= positive_charge ? mix_angle(positive_angle, mouse_angle, force) : positive_angle;
	}

	//clamp angle
	positive_angle		= positive_charge ? max(fract(positive_angle), MIN_FLOAT) : 0.;
	negative_angle		= negative_charge ? max(fract(negative_angle), MIN_FLOAT) : 0.;

	cell			= vec4(positive_field, negative_angle, negative_field, positive_angle);
	
	cell			= WRAP ? cell : clear_at_screen_edge(cell);
	cell			= reset_button(cell);
	
	gl_FragColor = cell;
}//sphinx


//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);;
}



float mix_angle( float angle, float target, float rate )
{    

   	angle = abs( angle - target - 1. ) < abs( angle - target ) ? angle - 1. : angle;
   	angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
	angle = fract(mix(angle, target, rate));   	
   	return bound(angle);
}

float bound(float angle)
{
	return max(angle,.00392156);
}

float witch(float x)
{
	x	= 1.-x;
	float w = .0625/(x*x+.0625);
	return 	w*w;
}

//clears the backbuffer, resetting the automata (also draws a button)
vec4 reset_button(inout vec4 cell)
{
	float button_size = 16./resolution.x;
	
	return cell *= float(mouse.x + mouse.y > button_size);
}




//adds a new cell at the position every frame
vec4 add_new_cell(inout vec4 cell, in vec2 position, in bool polarity)
{
	vec2 uv			= gl_FragCoord.xy/resolution.xy; 
	bool is_pixel	   	= abs(length(floor(gl_FragCoord.xy-position))) < 1.;
	float prior_angle	= polarity ? texture2D(renderbuffer, uv).y : texture2D(renderbuffer, uv).w; 
	float initial_angle	= max(fract(prior_angle - MIN_FLOAT * 51.), MIN_FLOAT);
	initial_angle		= hash(uv+fract(time*.001)).x;
	vec2 angle		= polarity ? initial_angle * vec2(1., 0.) : initial_angle * vec2(0., 1.);
    	
	cell 			= is_pixel ? vec4(0., angle.x, 0., angle.y) : cell;	
	return cell;
}


//adds a new cell at the position every frame
vec4 add_new_cells(inout vec4 cell, in vec2 position)
{

	vec2 uv			= gl_FragCoord.xy/resolution.xy; 
	vec2 seed		= hash(uv+fract(time*.001));
	bool is_pixel	   	= seed.x+seed.y < .05;
	bool polarity		= seed.x > seed.y;
	float prior_angle	= polarity ? texture2D(renderbuffer, uv).y : texture2D(renderbuffer, uv).w; 
	float initial_angle	= max(fract(512.*seed.x-32.*seed.y), MIN_FLOAT);
	vec2 angle		= polarity ? initial_angle * vec2(1., 0.) : initial_angle * vec2(0., 1.);
    	
	cell 			= is_pixel ? vec4(0., angle.x, 0., angle.y) : cell;	
	return cell;
}


//clears the cell if it reaches the screen border
vec4 clear_at_screen_edge(inout vec4 cell)
{
	return cell * float(gl_FragCoord.x > 1. && gl_FragCoord.y > 1. && gl_FragCoord.x < resolution.x-1. && gl_FragCoord.y < resolution.y-1.);
}