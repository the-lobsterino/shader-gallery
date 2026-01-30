#ifdef GL_ES
precision highp float;
#endif

//faux erosion
//putting the mouse in the bottom left will initialize the landscape function - from then on it runs off the buffer
//move the mouse to the far right side of the screen to "rain" everywhere
//move the mouse to the bottom left corner to reset

//map height is red, normal is green, and rain, blue


//https://youtu.be/kn8lX3HdnAs?t=19m

#define TRAILS			true	//trails
#define MAP			true	//implicit function map
#define REVERSE			false	//reverse path
#define COLLISION		false	//cell to cell collision

#define CHASE_MOUSE		false

#define ADD_CELLS_CENTER	false	//add at center pixe
#define ADD_CELLS_MOUSE		true	//add at mouse
#define ADD_CELLS_RANDOM	mouse.x > .75 //true	//add cells
#define ADD_CELLS_DEBUG		false	//add cells

#define WRAP			true	//wrap screen edges

//change this if the lines aren't straight - resolution/aspect ratio dependent
#define SEQUENCE_WORD_SIZE	255.
#define DEBUG_SEQUENCE		false

#define TAU 			(8.*atan(1.)) //2 pi

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

struct automata
{
	float	angle;
	float	trail;
	float	collision;
	float 	state;
	float	map;
	bool 	alive;
};

//automata functions
automata	read(vec4 pixel);
vec4 		write(automata cell);
vec2 		neighbor_offset(float i);
float 		sequence(float theta, vec2 uv);
automata	add(automata a, automata b);
automata	create(automata cell, vec2 uv);
float 		vector_to_angle( vec2 v );
float		mix_angle(float angle, float target, float rate);
float 		bound(float angle);
float 		angle_to_mouse();

//formatting
vec2 		uv_to_screen(vec2 uv);
float 		mask_screen_edges(float pixel_width);

//function maps - particles path on the derivative
float 		map(vec2 uv);
vec2 		derive(vec2 position, float offset);
vec2 		derive_prior(vec2 uv, float offset);

float 		hash(float v);
float 		value_noise(in vec2 uv);
float 		box(vec2 p, vec2 s);
float 		value_noise(in vec2 uv);
float 		fbm(float a, float f, vec2 uv, const int it);
mat2 		rmat(float theta);

float map(vec2 uv)
{
	vec2 position = uv_to_screen(uv);
	position += 8.;
	
	float field = fbm(.5, 1.25, position * 4., 12);
	field = max(field-uv.x*.45+.015, field * .1 + hash(uv.x + uv.y) * .004);
	return field;
}

void main( void )
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	//assign prior pixel to automata struct (for handling collisions and making trails)
	automata cell 	= read(texture2D(renderbuffer, uv));
	automata prior  	= cell;

	float normal	= 0.;
	float maxima 	= 0.;
	float roughness	= 0.;
	
	//loop through neighbors
	automata neighborhood;
	for ( int i = 0; i < 8; i++ )
	{
		//create offset uv
		vec2 offset_uv		= neighbor_offset(float(i));
		//offset_uv		*= 1.+ prior.trail*4.;
		offset_uv		= gl_FragCoord.xy - offset_uv * vec2(resolution.y/resolution.x, 1.);
		offset_uv		= fract(offset_uv/resolution);
		
		//get neighbor
		automata neighbor 	= read(texture2D(renderbuffer, offset_uv));
		neighbor.alive		= neighbor.angle != 0.;

		//add to neighborhood sum
		neighborhood		= add(neighbor, neighborhood);
		
		//derive normal by finding the tallest neighbor and pointing downhill
		normal 			= maxima < neighbor.map ? bound(fract(float(i)*.125-.0625) + (hash(normal)-.5) * .125) : normal;
		maxima 			= maxima > neighbor.map ? maxima : neighbor.map;
		roughness		+= abs(prior.map-neighbor.map)*.125;	
			
			
			
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
					cell.collision *= 0.;	
				}
				else if(COLLISION)
				{
					//hacky collision - still working that out...
					cell.angle	= bound(fract(cell.angle-neighbor.angle));
					cell.collision	= bound(1.-cell.angle);
				}
			}
		}
	}

	//resolve prior cell collisions
	if(COLLISION)
	{
		if(prior.collision != 0. && !cell.alive)
		{
			cell.alive 	= true;
			cell.angle	= prior.collision;
			cell.collision	= 0.;
		}
	}

	
	//add new cells
	if(!cell.alive)
	{
		cell 		= create(cell, uv);
	}
	
 
	//function
	if(MAP)
	{
		cell.map 		= prior.map;
		normal			= mix_angle(normal, hash(uv.x+uv.y+cell.map), .1);
		if(cell.alive)
		{
			float weight 	= .5;
			cell.angle	= mix_angle(cell.angle, normal, weight);
		}
		
	
		//erosion
		neighborhood.map 	*= .125;
		neighborhood.trail 	*= .125;
		
		float difference	= abs(cell.map - prior.map);
		float noise 		= hash(cell.map-cell.trail+uv.x+uv.y);
		if(neighborhood.trail > 0.)
		{
			//hacky parameterization for "erosion" - other things are possible
			//simulated deposition would be more efficient
			if(cell.alive)
			{

				float deposition = min(neighborhood.map, cell.map) * abs(cell.map-cell.trail) * 1.1;	
				cell.map	 = mix(prior.map, deposition, (1.-cell.map));
			}
			
			if(prior.trail == 0.)
			{
				float noise 	 = hash(cell.map-cell.trail);
				float deposition = mix(cell.map, neighborhood.map, max(prior.map, .25));
				cell.map	 = mix(cell.map, deposition, (1.-cell.map) * .5 * cell.trail);
			}
		}
		else
		{	
			float deposition = mix(prior.map, neighborhood.map, min(cell.map, .1));
			float weight	 = pow(cell.map, cell.map);
			cell.map	 = mix(cell.map, mix(neighborhood.map, cell.map, roughness * noise + cell.map), .5 * weight * cell.map);
			cell.map	 = mix(cell.map, deposition, weight * difference);

		}
		
		cell.collision		= abs(.5-normal)*(.25 + cell.map);
		cell.collision		= pow(cell.collision, .8);
		cell.collision		*= float(mouse.x > .1);

	}

	
	if(CHASE_MOUSE)
	{
		if(cell.alive)
		{
			cell.angle	= mix_angle(cell.angle, angle_to_mouse(), .5);
		}
	}
	
	//trails
	if(TRAILS)
	{
		float decay 	= .01;
		prior.trail 	= max(0., prior.trail - decay);
		cell.trail 	= cell.alive ? cell.trail + prior.trail : prior.trail;
		
		if(MAP)
		{
			float weight = .235;
			cell.angle -= cell.trail*.00625;
			float flood = neighborhood.trail * .15;
			cell.trail += flood * weight;
			cell.trail -= cell.map * .125;

		}
	}
	else
	{
		cell.trail *= float(cell.alive);
	}
	
	
	//debug sequence function
	if(DEBUG_SEQUENCE)
	{
		cell.trail 	*= 0.;
		cell.trail 	= sequence(vector_to_angle(vec2(0.)-uv_to_screen(uv)), uv);
		cell.trail 	+= cell.alive ? 1. : cell.trail * .0125;
	}
	
	
	
	//cutoff screen edges
	cell.angle 		*= mask_screen_edges(1.);
	
	
	//clear if mouse is in the bottom left corner
	bool reset		= mouse.x+mouse.y < .1 || cell.map == 0.;
	if(reset)
	{
		cell = read(vec4(0.));
		
		if(MAP)
		{
			cell.map = map(uv);
		}
	}
	
	gl_FragColor 		=  write(cell);
}//sphinx


//format cell -  using a struct is inefficient, but handy
automata read(vec4 pixel)
{
	automata cell;
	cell.collision	= pixel.y;
	cell.trail	= pixel.z;
	cell.map	= pixel.x;
	cell.angle  	= pixel.w;
	return cell;
}


//write out cell
vec4 write(automata cell)
{
	vec4 result;
	result.y	= cell.collision;
	result.z 	= cell.trail;
	result.x	= cell.map;
	result.w 	= cell.angle;
	
	return result;
}

automata add(automata a, automata b)
{
	a.angle 	+= b.angle;
	a.trail		+= b.trail;
	a.collision 	+= b.collision;
	a.map		+= b.map;
	a.alive		= a.alive || b.alive;
	
	return a;
}

//returns an offset at each pixel for
float sequence(float theta, vec2 uv)
{
	float phase		= min(theta, fract(theta-.5));
	bool axis		= phase < .125 ^^ phase > .375;
	
	uv 			= abs(uv_to_screen(uv));
	phase		= axis ? uv.y :  uv.x;
	
	float rotation	= mod(phase*SEQUENCE_WORD_SIZE, .125);
	theta		= fract(theta+rotation);
	
	return theta;
}

//cell trail(automata cell)
//{
//	return cell;
//}

//takes an index 0-7 and returns the moore neighborhood offset
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.) * (REVERSE ? 1. : -1.);
}

automata create(automata cell, vec2 uv)
{
	vec2 fc			= floor(gl_FragCoord.xy);
	vec2 noise		= vec2(0.);
	noise.x 		= hash(1.-uv.x+uv.y+mouse.x+hash(.5+mouse.x+uv.y));
	noise.y 		= hash(1.+uv.x-uv.y-mouse.y+hash(.5-mouse.y+uv.x));
	
	bool center_pixel 	= floor(resolution * .5)	== fc;
	bool mouse_pixel 	= abs(floor(mouse * resolution) - fc) == vec2(floor(noise * 4.));
	bool random_pixel 	= dot(mouse, noise)		<= .01 * (mouse.x+mouse.y);
	
	mat2 rm = rmat((mouse.x-.5)*TAU);
	bool debug_pixel	=  floor(resolution * .5) == floor(fc - vec2(resolution * .22) * rm) || floor(resolution * .5) == floor(fc + vec2(resolution * .22) * rm);;
	
	cell.alive 		= true;
	if(ADD_CELLS_CENTER && center_pixel)
	{
		cell.angle = fract(cell.angle + 1./256.);
	}
	else if(ADD_CELLS_MOUSE && mouse_pixel)
	{
		cell.angle = fract(noise.x+noise.y);
	}
	else if(ADD_CELLS_RANDOM && random_pixel)
	{
		cell.angle = fract(noise.x);
	}
	else if(ADD_CELLS_DEBUG && debug_pixel && mouse.y > .9)
	{
		cell.angle = vector_to_angle(vec2(.0)-uv_to_screen(uv)+.001);
	}
	else
	{
		cell.alive = false;
		cell.angle = 0.;
	}
	
	cell.trail += float(cell.alive);
	
	return cell;
}

//turns a 2d vector into an "angle" in the 0-1 domain
float vector_to_angle(vec2 v)
{
	return bound(fract(atan(v.x, v.y)/TAU));
}


float angle_to_mouse()
{
	vec2 position   = uv_to_screen( gl_FragCoord.xy / resolution.xy );
	vec2 mouse_pos  = uv_to_screen( mouse );
	vec2 v          = (mouse_pos - position);
	return vector_to_angle(v);
}

float mix_angle( float angle, float target, float rate )
{
	angle 	= abs(angle - target + 1.) < abs(angle - target) ? angle  + 1. : angle;
	target 	= abs(target - angle + 1.) < abs(angle - target) ? target + 1. : target;
	angle 	= fract(mix(angle, target, rate));
	return bound(angle);
}

//prevent angles from hitting zero
float bound(float angle)
{
	return max(angle, .00392156);
}

//centers coordinates and corrects aspect ratio
vec2 uv_to_screen(vec2 uv)
{
	uv       = uv - .5;
	uv.x     *= resolution.x / resolution.y;
	return uv;
}

//returns 0 if within the width of the screen edge
float mask_screen_edges( float width )
{
	return  !WRAP && (gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width) ? 0. : 1.;
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
vec2 derive_prior(float x0, float x1, float y0, float y1)
{
	vec2 normal  = vec2(0.);
	normal.x     = x0 - x1;
	normal.y     = y0 - y1;
	return normalize(normal);
}


//2d rotation matrix
mat2 rmat(float theta)
{
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c,s,-s,c);
}


//simple hash function - high bitwise entropy in the uv domain
float hash(float v)
{
	return fract(fract(v*9876.5432)*(v+v)*12345.678);
}


//value noise - random values smoothed across a lattice
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


//fractal brownian motion (aka perlin noise)
float fbm(float a, float f, vec2 uv, const int it)
{
	float n = 0.;
	uv *= rmat(.3);
	for(int i = 0; i < 32; i++)
	{
		if(i<it)
		{
			n += value_noise(uv*f)*a;
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


//distance to box
float box(vec2 p, vec2 s)
{
	vec2 d = abs(p) - s;
	return min(max(d.x, d.y), 0.0) + length(max(d, vec2(0.)));
}

