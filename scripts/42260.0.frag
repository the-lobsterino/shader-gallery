precision highp float;
uniform vec2      	mouse;
uniform vec2      	resolution;
uniform sampler2D	renderbuffer;
uniform float 		time;

//living paint for future cities
//not a fluid sim, more of a color spinner



#define MOUSE_INPUT		(.125)  
#define MOUSE_RANGE		(length(uv*aspect-mouse*aspect))  

#define TURBULENCE		(2. * MOUSE_INPUT/MOUSE_RANGE)	
#define VISCOSITY		(64.)					//neighbor order randomness - some values will break it

#define RESET			(mouse.x + mouse.y < .1) 		//put the mouse in the bottom left corner to reset
#define INITIALIZE		(time < 2.)
#define WRAP 			true					//edge wrapping

#define fract(x)		(x - floor(x))

float hash(float v);
float hash(vec2 uv);
vec4  hash(vec4 uvwt);
float mod_mix(float a, float b, float r);
vec4 mod_mix(vec4 a, vec4 b, float r);
vec2 neighbor_offset(float i);


vec4 paint() 
{
	vec2 uv			= gl_FragCoord.xy/resolution;
	vec2 field		= vec2(hash(uv.x+hash(uv.y)), hash(uv.y+hash(uv.x)));
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	float cursor		= length(uv * aspect - mouse * aspect);
	vec4 cell_prior		= texture2D(renderbuffer, uv);
	vec4 cell_noise		= hash(uv.xyxy+cell_prior);
	vec4 cell_next		= cell_prior;

	float sum		= dot(cell_prior,vec4(1.))/4.;
	for (float i = 0.; i < 8.; i++)
    	{		
		float noise		= hash(fract((8.-i) * field.x + i * field.y));
		
		vec2 neighbor_uv 	= gl_FragCoord.xy - neighbor_offset(mod(i + floor(VISCOSITY * sum - noise), 8.));
		neighbor_uv		= neighbor_uv/resolution;
		neighbor_uv		= WRAP ? fract(neighbor_uv) : neighbor_uv;

		vec4 neighbor 		= texture2D(renderbuffer, neighbor_uv);
		float delta		= dot(neighbor, cell_prior)/4.;
		
		float sequence		= abs(fract(neighbor.w) - .5) < .25 ? field.x : field.y;		
		sequence		= fract(neighbor.w + sequence * delta);
				
		cell_next 		= mod_mix(cell_next, neighbor, sequence * TURBULENCE);
	}	

	
	cell_next 	= RESET || INITIALIZE || cursor < .0125 ? cell_noise : cell_next;
	

	return cell_next;
}//sphinx


void main() 
{
	gl_FragColor = paint();	
}


//white noise
float hash(float v)
{
	v *= 1234.56789;
	return fract(v * fract(v));	
}

float hash(vec2 uv)
{
	return hash(uv.x + uv.y * hash(uv.x - uv.y));
}	


vec4 hash(vec4 uvwt)
{
	return vec4(hash(.123456789 + uvwt.xy), hash(.678912345 + uvwt.yz), hash(.987654321 + uvwt.zw), hash(.12349876 + uvwt.wx));
}	


float mod_mix(float a, float b, float r)
{    
	a 		= abs( a - b - 1. ) < abs( a + b ) ? a - 1. 	: a;
	a 		= abs( a - b + 1. ) < abs( a - b ) ? a + 1. 	: a;
	r 		= r < .25 && abs(a - b) > r ? r * 1./abs(a - b) : r; //forced convergence for small interpolants
	return fract(mix(a, b, r));
}


vec4 mod_mix(vec4 a, vec4 b, float r)
{    
	return vec4(mod_mix(a.x, b.x, r),mod_mix(a.y, b.y, r),mod_mix(a.z, b.z, r),mod_mix(a.w, b.w, r));
}



//returns the sequence of offsets for the moore neighborhood
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}
