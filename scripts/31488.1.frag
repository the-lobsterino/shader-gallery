#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

#define TAU 			(8.*atan(1.))
#define FREQUENCY 		185./32.


float 	reflect_angle(float incident, float normal);
float 	mask_screen_edges( float width );
float	vector_to_angle( vec2 v );
vec2	angle_to_vector(float a);
vec2 	format_to_screen( vec2 p );
float 	mix_angle( float angle, float target, float rate );
float 	angle_to_mouse();
float	map(vec2 position);
vec2	derive(vec2 position, float offset);
vec2	derive_prior(vec2 uv, float offset);
float	value_noise(in vec2 uv);
float 	fbm(vec2 uv);
vec2 	neighbor_offset(float i);	
float   mix_angle( float angle, float target, float rate );
float   bound(float angle);
float   hash(float x);
float   hash(vec2 uv);

void main( void ) 
{   
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	vec2 position 		= format_to_screen(uv);
	
	vec4 cell 		= vec4(0.);
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	float prior_error 	= 0.;
	float prior_collision 	= 0.;
	float collision		= prior_cell.y;
	vec2 field		= gl_FragCoord.xy * FREQUENCY;
	vec4 sum			= vec4(0.);
	
	vec4 neighbor[8];
	for (int i = 0; i < 8; i++)
    	{
		vec2 neighbor_uv 	= gl_FragCoord.xy - neighbor_offset(float(i));
		neighbor_uv		= fract(neighbor_uv/resolution);

		neighbor[i]		= texture2D(renderbuffer, neighbor_uv);

		float angle 		= neighbor[i].w;
		
		sum.xyz 		+= neighbor[i].xyz;
		
		if (angle != 0.)
		{   
			sum.w 		+= 1.;
			//rotate angle based on 
			float sequence		= abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;
			sequence 		= fract(sequence) * .125;
			sequence			= fract(angle + sequence);
		
			bool transmit		= int(sequence * 8.) == i;
			
			
			//record any collision in red channel	
			cell.x 		= cell.w != 0. && transmit ? cell.w : cell.x; 
			prior_collision = prior_collision == 0. && neighbor[i].x > 0. ? neighbor[i].x : prior_collision;	
			
			//in case of collision, check to see if this would win out
			float error 	= abs(sequence - float(i) * .125 * .125);
        		transmit 	= transmit && prior_error < error;
		
			if(transmit) 
			{
				cell.zw 			= neighbor[i].zw;
				
				prior_error 		= error;
				
				vec4 new_cell		= vec4(0., 1., prior_collision, reflect_angle(cell.x, prior_collision));
				cell   			= prior_collision != 0. ? new_cell : cell;			
			}
		}
	}
	
	
	//derive normal
	vec4 d_x 		= (neighbor[5] + neighbor[6] + neighbor[7]) - (neighbor[1] + neighbor[2] + neighbor[3]); //left right
	vec4 d_y 		= (neighbor[3] + neighbor[4] + neighbor[6]) - (neighbor[1] + neighbor[0] + neighbor[7]); //top bottom

	float normal            = vector_to_angle(normalize(vec2(d_x.y, d_y.y)));	
	float flow 		= vector_to_angle(normalize(vec2(d_x.w, d_y.w)));	
	sum 			/= 8.;
	
	
	//path and terrain modification
	if(cell.w != 0.)
	{
		//terrain collision
		bool collide		= collision > .65;
		float reflection_angle  = reflect_angle(-cell.w, normal);
		cell.zw 			= collide ? vec2(reflection_angle) : cell.zw;        

		
		//terrain influence
		float terrain_influence = .0;
		cell.w 			= collide ? cell.w :  mix_angle(cell.w, hash(uv), terrain_influence*prior_cell.y);
		
		//neighbor influence	
		if(sum.w > 0.)
		{
			float flow_influence	= .0;
			cell.w 			= mix_angle(cell.w, flow, flow_influence);
		}
	
		//terrain_modification
		float weight = .5;
		cell.y = collide ? prior_cell.y - weight: prior_cell.y;
		
		//add terrain
		//cell.y = prior_cell.y == 0. ? bound(cell.y - sum.z * weight) : sum.z;
	}
	else
	{
		bool solid	= collision > .65;
		if(solid)
		{
			cell.y =  mix(prior_cell.y, sum.y, prior_cell.z);	
		}
		
		cell.y = mix(prior_cell.y, sum.y, abs(cell.y-prior_cell.y));
		
	}	
	
	//create new cells at the center of the screen
	float t			= fract(time * .05);
	bool center_pixel	= length(floor(gl_FragCoord.xy - resolution * .5)) < 1.;
	//bool random_pixel	= length(mod(floor(gl_FragCoord.xy - resolution * .5 + resolution * (vec2(hash(uv+t), hash(1.+t-uv))-.5)), resolution)) < 1.;
	//bool mouse_pixel		= length(floor(gl_FragCoord.xy - resolution * mouse)) < 1.;
	bool add_cells		= mouse.x > .1 && prior_cell.w == 0.;
	if(add_cells && center_pixel)
	{
//		float new_angle		= fract(t + hash(t));
		float new_angle		= fract(t);
		vec4 new_cell		= vec4(1., 1., 1., bound(new_angle));
		cell			= new_cell;
	}
	else
	{
		//trails
		cell.z = float(cell.z>0.) + prior_cell.z-.025;
	}
	
	//collision handling - spawn a cell if one was wiped out prior
	float leave_collision = .0;
	cell = prior_cell.x != 0. && cell.w == 0. ? vec4(0., leave_collision, prior_cell.x, reflect_angle(prior_cell.x, prior_cell.w)) : cell;
	

	//edge mask
	//cell.w 		*= mask_screen_edges(1.);
	
	
	//reset
	bool reset 	= mouse.x + mouse.y > .1;
	cell 		*= float(reset);
	
	//terrain generation 
	bool new_collision = cell.y == 0. || (mouse.x + mouse.y < .02) || time < 2.;
	if(new_collision)
	{
		collision		= map(position + 54.);
		collision 		+= step(.5, collision)-.25;
		cell.y 			+= collision - step(1., collision)*.6 ;
		cell.y			= bound(cell.y+.1);
	}
	
	gl_FragColor = cell;
}//sphinx

//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}

float hash(float x)
{
	x *= 1234.5678;
	return fract(x / fract(x));
}

float hash(vec2 uv)
{
	return hash(uv.x+hash(uv.y));
}

//reflection
float reflect_angle(float incident, float normal)
{
	return fract(abs(normal)*2.-incident-.5);
}


//maps a normalized 2d vector to a 0-1 float on a radial gradient
float vector_to_angle( vec2 v )
{
	return bound(fract(atan(v.x,v.y))*.15915494);
}


vec2 angle_to_vector(float a)
{
	vec2 v = vec2(a, a) * TAU;
	return normalize(vec2(cos(v.x),sin(v.y))).yx;
}

//returns a normalized vector from the current screen pixel to the mouse position
float angle_to_mouse()
{
	vec2 position   = format_to_screen( gl_FragCoord.xy / resolution.xy );
	vec2 mouse_pos  = format_to_screen( mouse );
	vec2 v          = mouse_pos - position;
	return vector_to_angle( v );
}

vec2 format_to_screen( vec2 p )
{
	p       = p * 2. - 1.;
	p.x     *= resolution.x / resolution.y;
	return p;
}
				   
float mask_screen_edges( float width )
{
    return  gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width ? 0. : 1.;    
}

float  map(vec2 position)
{
    float n = fbm(position);
    float c = length(position-format_to_screen(mouse));
    return max(0., n+step(.5, n)*.125);
}


//partial derivitive of map function (the surface normal)
vec2 derive(vec2 position, float offset)
{
    vec2 epsilon = vec2(offset, 0.);
    vec2 normal  = vec2(0.);
    normal.x     = map( position + epsilon.xy ) - map( position - epsilon.xy );
    normal.y     = map( position + epsilon.yx ) - map( position - epsilon.yx );
    return normalize(normal);
}


//same as above, but from the backbuffer - use this to avoid having to recalculate a field function
vec2 derive_prior(vec2 uv, float offset)
{
    vec3 epsilon = vec3(offset + 1.5, offset + 1.5, 0.) * vec3(1./resolution, 1.);
    vec2 normal  = vec2(0.);
    normal.x     = texture2D(renderbuffer, uv + epsilon.xz ).x - texture2D(renderbuffer, uv - epsilon.xz ).x;
    normal.y     = texture2D(renderbuffer, uv + epsilon.zy ).x - texture2D(renderbuffer, uv - epsilon.zy ).x;
    return normalize(normal);
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
	return max(angle, .00392156);
}

//perlin's value noise
float value_noise(in vec2 uv)
{
    	const float k 	= 257.;
    	vec4 l  		= vec4(floor(uv),fract(uv));			//create a low resolution grid (xy) and repeating blend (zw) 
	l.zw    		= l.zw*l.zw*(3.-2.*l.zw);			//smooth the values for the repeating blend
	
    	float u 		= l.x + l.y * k;					//create an index for each 2d grid position
    	vec4 v  		= vec4(u, u+1.,u+k, u+k+1.);			//get the 4 indices corrosponding to the 4 neighbor grid points as v.xyzw
    	v       		= fract(fract(1.23456789*v)*v/.987654321);	//generate a random number for each of the 4 neighbor indices
    
									//for the result, mix the random numbers from the grid using the blend 
    	l.x     		= mix(v.x, v.y, l.z);				//bottom left right
    	l.y     		= mix(v.z, v.w, l.z);				//top left right
    	return mix(l.x, l.y, l.w);					//top to bottom
}
 

//fractal brownian motion, aka perlin noise - when using values of .5 and 2. it's also known as "pink noise"
float fbm(vec2 uv)
{
	float amplitude = .5;						//amplitude is how much to add per step
	float frequency = 2.;						//frequency is how much to change scale at each step
	
	float result	= 0.;						//iteratively stack layers of value noise to create perlin noise
	for(int i = 0; i < 8; i++)
	{
		result 		+= value_noise(uv*frequency)*amplitude;	//add value noise, using the frequency and amplitude to control it
        	amplitude 	*= .5;					//at each step, half the amount you add
        	frequency 	*= 2.;					//and double the spatial frequency 
   	}
	
    	return result;
}
