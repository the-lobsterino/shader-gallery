precision highp float;

uniform vec2      resolution;
uniform sampler2D renderbuffer;
uniform vec2 	  mouse;


//line automata - living cells are represented by an angle in the alpha channel
vec2 neighbor_offset(float i);	

#define PHI 			(sqrt(5.)*.5+.5)
#define USE_PHI 		
//#define SHOW_SEQUENCE 		
//#define SHOW_MAP 	

#define PATH 			1
#define POSITIVE 		0
#define NEGATIVE		2

float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}


vec2 smooth(vec2 uv)
{
    return uv*uv*(3.-2.*uv);
}


//value noise
float noise(in vec2 uv)
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(1.23456789*v)*v*(1./.987654321));
    l.zw    = smooth(l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}


//fractal brownian motion
float fbm(float a, float f, const in vec2 uv)
{
    float n = 0.;
    for(float i = 0.; i < 6.; i++)
    {	
	    n += noise(uv*f)*a;
	    a *= .5;
	    f *= 2.;
    }
    return n;
}

float map(vec2 p)
{
	return fbm(.5, (2.+p.x/resolution.x)/min(resolution.x, resolution.y), p - resolution);
}


vec3 gradient(vec2 position)
{
	vec2 epsilon 	= vec2(.5/min(resolution.x, resolution.y), .0);
	vec2 normal	= vec2(0., 0.);
	normal.x	= map(position + epsilon.xy) - map(position - epsilon.xy);
	normal.y	= map(position + epsilon.yx) - map(position - epsilon.yx);
	return vec3(normalize(normal), map(position));
}



float rotate(float angle, float target, float rate)
{
	angle 	= abs(angle - target + 1.) <= abs(angle - target) ? angle  + 1. : angle;
	target 	= abs(target - angle + 1.) <= abs(angle - target) ? target + 1. : target;
	target  = mix(angle, target, rate);  
	return target - floor(target);
}


void main() 
{
	//initialize output
	vec4 cell		= vec4(0., 0., 0., 0.);
	
	//a sequence of values across the field such that their amplitude and spatial frequency encode the correct sequence of moves for the specifed angles
	#ifdef USE_PHI 
		vec2 sequence 		= mod(gl_FragCoord.xy * PHI, 1.);
	#else
		vec2 sequence 		= mod(gl_FragCoord.xy * 32., 25.)/25.;	
	#endif
	
	sequence			/= 8.;

	
	//sample the 8 immediate neighbor pixels (no need to sample this pixel, anything that matters will be incoming)
	for (float i = 1.; i < 9.; i++)
    	{
		//create sample position
		vec2 uv_neighbor 	= ceil(neighbor_offset(i));
		vec2 neighbor_uv 	= (gl_FragCoord.xy + uv_neighbor + .5/resolution)/resolution;
		neighbor_uv		= fract(neighbor_uv);
		
		//sample for an incoming angle
		float path		= texture2D(renderbuffer, neighbor_uv)[PATH];
		float positive		= texture2D(renderbuffer, neighbor_uv)[POSITIVE];
		float negative		= texture2D(renderbuffer, neighbor_uv)[NEGATIVE];
		
		//if it isn't empty, check to see if it is aligned to enter the current cell
		//if(path != 0.)
		{
					
			bool axis		= abs(fract(path * 2.) - .5) <= .25;			
			float determinant	= !axis ? sequence.x : sequence.y;			
			bool aligned 		= ceil(mod(path + determinant, 1.) * 8.) == i;
			
			if(aligned)
			{
				cell[PATH]	= path;
			}
		}
		
		//if(positive != 0.)
		{
					
			bool axis		= abs(fract(positive * 2.) - .5) <= .25;			
			float determinant	= !axis ? sequence.x : sequence.y;			
			bool aligned 		= ceil(mod(positive + determinant, 1.) * 8.) == i;
			
			if(aligned)
			{
				cell[POSITIVE]	= positive;
			}
		}
		
		//if(negative != 0.)
		{
					
			bool axis		= abs(fract(negative * 2.) - .5) <= .25;			
			float determinant	= !axis ? sequence.x : sequence.y;			
			bool aligned 		= ceil(mod(negative + determinant, 1.) * 8.) == i;
			
			if(aligned)
			{
				cell[NEGATIVE]	= negative;
			}
		}
	}	
	
	
	//the code above is everything for moving the cells - the code below is for adding new cells, creating trails, etc..
	
	
	//add new cells (here the prior state is used to generate a new angle)
	vec4 prior_cell		= texture2D(renderbuffer, gl_FragCoord.xy/resolution); 	
	
	float seed		= noise(gl_FragCoord.xy+mouse-length(cell)) - .5;
	bool mouse_pixel 	= length(gl_FragCoord.xy - floor(mouse * resolution)) < 1.;
	bool add_cell		= mouse_pixel;// || cell[PATH] == 0.;
	
	vec2 aspect		= resolution/max(resolution.x, resolution.y);	
	vec2 direction		= -normalize((gl_FragCoord.xy/resolution - .5) * aspect - (mouse - .5) * aspect);
	float new_path		= seed;//unit_atan(direction.y, direction.x);
	new_path		= cell[PATH] == 0. ? new_path : 0.;
	
	
	//trails
	cell[POSITIVE]		= cell[PATH] > 0. && cell[POSITIVE] == 0. ? fract(cell[PATH] + .25) : cell[POSITIVE]; 
	cell[NEGATIVE]		= cell[PATH] > 0. && cell[NEGATIVE] == 0. ? fract(cell[PATH] + .75) : cell[NEGATIVE]; 
	

	
	cell[PATH]		= add_cell ? seed : cell[PATH];
	
	
	vec3 function		= gradient(gl_FragCoord.xy);
	float slope		= fract(unit_atan(function.y, function.x));

	cell[PATH]		= cell[PATH] > 0. ? rotate(cell[PATH], rotate(cell[PATH], slope, .05125), .25) : prior_cell[PATH];
	
	#ifdef SHOW_SEQUENCE 
		cell.xyz	*= 0.;
		cell.xy		= sequence * 8.;
		cell.w		= 1.;
	#endif
	
	#ifdef SHOW_MAP
	cell.xyz		*= 0.;
	cell.xyz 		+= gradient(gl_FragCoord.xy);
	#endif
	
	
	//clear the screen if the mouse is in the bottom left corner
	cell			*= mouse.x + mouse.y > .2 ? 1. : 0.;

	cell.w			= 1.;
			
	gl_FragColor		= cell;	
}//sphinx



//returns the offsets for the neighboring cells in the neighborhood around a square spiral - (0., 0.), (1., 0.), (1., 1.), (0., 1.)... (ulam spiral)
vec2 neighbor_offset(float i)
{
	float r	= sqrt(i+.5);
	float s = 3. - fract(r) * 4.;	
	r	*= mod(r, 2.) > 1. ? .5 : -.5;
	
	return s > 1. ? vec2(r, 2. * r - r * s) : vec2(r * s, r);
}
