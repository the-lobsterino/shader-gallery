#ifdef GL_ES
precision highp float;
#endif

//Isotropic Automata by Chris Birke - Unbound Technologies Inc.
//
//Licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
//Based on a work at http://glslsandbox.com/e#21210.1
//Email with questions, improvements, and curiosity - cbirke@gmail.com

//incorporate laplatin fluid - wave interactions still incorrect

//// HEADER
#define TAU    (8.*atan(1.))
#define PI     (4.*atan(1.))

uniform vec2      mouse;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

vec2   wrap_and_offset_uv( vec2 uv, vec2 offset);                  //wrapped uv neighbors
float  vector_to_angle(vec2 v);                                    //2d vector to 1d angle
vec2   angle_to_vector(float a);                                   //1d angle to 2d vector
float  mix_angle( float angle, float target, float rate );         //wrapped angle mix (handles crossing 0.->1.)
float  clamp_angle( float angle );                                 //clamps to min and max > 0 8 bit angle values
float  reflect_angle(float particle, float normal);                //angle reflection
float  angle_to_mouse();
float  add_at_position( float probability, float angle, vec2 position );
float  add_at_random( float probability, float angle);

//cheap hashes
float  hash(float v);
float  position_hash( vec2 uv );
float  time_position_hash( vec2 uv );

//screen formatting
vec2   format_to_screen( vec2 uv );
float  mask_screen_edges( float width );

//map functions
float  map(vec2 position);
vec2   derive(vec2 position, float offset);
vec2   derive_prior(vec2 uv, float offset);
float  box(vec2 p, vec2 s);
mat2   rmat(float t);

float  lens(vec2 position);
float  distorted_lens(vec2 position);
vec2   smooth(vec2 uv);
float  value_noise(in vec2 uv);
float  fbm(float a, float f, vec2 uv, const int it);
//// END HEADER




//// CONTROL PARAMETERS
#define ADD_AUTOMATA
	//#define SIDE_ADD
	//#define RANDOM_ADD   .005
	#define POINT_ADD    .015
        		#define ADD_POSITION vec2(.5)
	
	#define ADD_INITIALIZATION_ANGLE time_position_hash(uv * 2.)
	
#define TRAILS 0.5  
	#define TRAIL_DECAY .05


//#define CHASE_MOUSE .15
	#define CHASE_RANGE .125

//#define AUTOMATA_COLLISION

#define MAP_COLLISION
	#define MAP_THRESHOLD .55
	#define MAP_RESTITUTION .005
	#define MAP_INFLUENCE 0.
	#define MAP_SHOW_COLLISION 1.

#define FLUID
	#define FLUID_VISCOSITY		.8
	#define FLUID_COMPRESSION	.01

#define WRAP
//// END CONTROL PARAMETERS


//// MAIN
//the method requires no input but the coordinates and one channel of the back buffer 
//everything else here is just one example of their use
void main() 
{   
	vec2 uv = gl_FragCoord.xy / resolution.xy;  
   	
	//an array of position offsets for the moore neighborhood
	//8 pixels around the current one, starting at the bottom and looping round to the top counter clockwise
    	vec2 neighbor_offset[8]; 
    	neighbor_offset[0] = vec2(  0., -1. ); //*.2
    	neighbor_offset[1] = vec2( -1., -1. ); //*.05
    	neighbor_offset[2] = vec2( -1.,  0. ); //*.2
	neighbor_offset[3] = vec2( -1.,  1. ); //*.05
	neighbor_offset[4] = vec2(  0.,  1. ); //*.2
	neighbor_offset[5] = vec2(  1.,  1. ); //*.05
	neighbor_offset[6] = vec2(  1.,  0. ); //*.2
	neighbor_offset[7] = vec2(  1., -1. ); //*.05
      
	
	
	//check neighbors to see if any are angled to this current position
	vec4 cell 		= vec4( 0. );
	bool alive 		= false;
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	
	#ifdef FLUID
	vec4 lapacian 		= (2.0 * texture2D(renderbuffer, uv) - 1.0);
	vec4 prior_wave		= lapacian;
	float wave_angle	= prior_cell.w;
	float wave_max		= 0.;
	#endif 
	
	for ( int i = 0; i < 8; i++ )
    	{
		//create neighbor cell position
		vec2 neighbor_uv 	= fract(uv + neighbor_offset[i]/resolution);
		
		//get neighbor cell
		vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		float neighbor_angle 	= neighbor_cell.w;
		
		bool is_occupied	= neighbor_angle != 0.;
		if (is_occupied)
		{   
			//see http://glslsandbox.com/e#21453.6 for some visualization of the traversal 
			
			float sample_angle 	= min(neighbor_angle, fract( neighbor_angle + .5 ));    

			bool axis	        = sample_angle <= .125 || sample_angle > .375;
			
			//note - the sample aliasing is very precise with relation to the resolution of the browser window
			vec2 sample_uv		= gl_FragCoord.xy + neighbor_offset[i];
			sample_uv		*= 256.;
			sample_uv		/= resolution.xx/resolution.yy;
			
			float sample		= axis ? sample_uv.y  : sample_uv.x;
			sample 			= mod(sample, .125);
			float probability	= fract(neighbor_angle + sample);  
            		
			bool approaching        = floor(probability * 8.) == float( i );
			approaching             = approaching && cell.w > 0. ? probability <= .375 : approaching;
			if ( approaching ) 
			{
				cell.w = neighbor_cell.w;
				alive = true;
				
				#ifdef AUTOMATA_COLLISION
				cell.x = cell.w;
				#endif
			}
			
			#ifdef AUTOMATA_COLLISION
			cell.x = clamp_angle( float( 8 - i ) * .125 );		
			#endif
	    	}   
		
		#ifdef FLUID
		float weight 		= mod(float(i), 2.) == 1. ? .2 : .05;
		lapacian 		-= weight * (2. * neighbor_cell - 1.);
		wave_max		= neighbor_cell.y >= wave_max ? neighbor_cell.y : wave_max;
		wave_angle 		= wave_max == neighbor_cell.y ? mod(float(4+i),8.)*.125 : wave_angle;


		#endif
	}
	
	#ifdef TRAILS
	//get the last trail value from the y channel and fade it out
	//cell.y                = alive ? prior_cell.y + TRAILS : prior_cell.y - TRAIL_DECAY;
	#endif
    
	
    	#ifdef ADD_AUTOMATA
	//various ways to add automata 
        if(!alive)
        {
		#ifdef POINT_ADD
                cell.w += add_at_position( POINT_ADD, ADD_INITIALIZATION_ANGLE , ADD_POSITION);
 		#endif

		#ifdef RANDOM_ADD
                cell.w += add_at_random( RANDOM_ADD,  ADD_INITIALIZATION_ANGLE );
		#endif
		
		#ifdef SIDE_ADD
		cell.w = gl_FragCoord.x <= 1.5 && mod(gl_FragCoord.y, 1.) < 1. && fract(time+uv.y*.5) < .125 ? .25 : 0.;
		#endif
        }
    	#endif
    
    
    	#ifdef CHASE_MOUSE
	//turns particles to the mouse if they are within range
        float range = distance(format_to_screen(uv), format_to_screen(mouse));
        if(range < CHASE_RANGE && alive)
        {
            cell.w = mix_angle(cell.w, mix_angle(cell.w, angle_to_mouse(), CHASE_MOUSE), CHASE_MOUSE);
        }
    	#endif
    
	

    	#ifdef AUTOMATA_COLLISION
	//bounces particles off one another - bounces are not very accurate
        if(alive)
        {
            vec2 uv_projection    = format_to_screen(uv) + angle_to_vector(cell.w) * 2./resolution;
            vec4 forward_cell     = texture2D(renderbuffer, uv + uv_projection);  
            bool collision        = alive && forward_cell.w != 0.;
            cell.w                = collision ? reflect_angle(cell.w, forward_cell.w) : cell.w;  
        }
    	#endif 
    
    
    	#ifdef MAP_COLLISION
	//uses a scalar function (heigh map) as a basis for environmental interactions (collision, pathing, etc.)
        vec2 position           = format_to_screen(uv);
        float collision         = map(position);
    
        if(alive)
        {
		vec2 projected_position		= position + angle_to_vector(cell.w) * 2./resolution;
		float projected_collision	= map(projected_position);
        
		float normal			= vector_to_angle(derive(projected_position, .02));
		float reflection_angle		= reflect_angle(cell.w, normal);
		float escape_angle		= clamp_angle(vector_to_angle(-derive(position, MAP_RESTITUTION)));
                 
		cell.w 				= projected_collision > MAP_THRESHOLD ? reflection_angle : cell.w;        
		cell.w 				= collision           > MAP_THRESHOLD ? escape_angle     : cell.w;         
        }
    
        //visualize map in blue
	#ifdef MAP_SHOW_COLLISION
	float boundaries = step(MAP_THRESHOLD, collision);
        cell.z		 = boundaries;
	#endif
    	#endif 
    
    
	#ifndef WRAP
	//mask the screen edges so particles dont wrap if wrapping is not defined
	cell.w *= mask_screen_edges(1.);
	#endif

	#ifdef FLUID
	if(collision<MAP_THRESHOLD)
	{
		//energy conservation
		prior_wave.yz 		= mix(prior_wave.yz, prior_wave.zy, abs(lapacian.yz-lapacian.zy)*-FLUID_COMPRESSION);
	
		//wave energy
		float prior		= prior_wave.z - lapacian.y  * FLUID_VISCOSITY;
		float current		= prior_wave.y + prior;
	
		if (!alive)
		{
			cell.yz = vec2(current, prior);
		}
		else
		{

			cell.w = prior_cell.x != .5 && prior_cell.z > 0. ? mix_angle(cell.w, mix_angle(cell.w+.125, cell.w-.25, .25+prior_cell.z-prior_cell.x), .125) : cell.w;
			cell.xyz = vec3(1., cell.y+2.5, 0.);	
			
		}
		cell.yz = cell.yz * .5 + .5;
		cell.yz = cell.z == 0. ? vec2(.51) : cell.yz;
		cell.x  = wave_angle;
	}
	#endif
	
	//reset on mouse in corner
	cell *= float( mouse.x + mouse.y > .02 );
        
	
	
	gl_FragColor = cell;
}//sphinx
//// END MAIN




//// ENVIRONMENT FUNCTIONS
//function map (a heightfield)
float  map(vec2 position)
{
	float n = fbm(.5, 2., position, 5);
	float c = length(position-format_to_screen(mouse));
	c = step(c, n*.25);
	float l = lens(position);

	l		= l*l*(3.-2.*l);
	l		= l*l*(3.-2.*l);

	return max(0., n);
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
	normal.x     = texture2D(renderbuffer, uv + epsilon.xz ).z - texture2D(renderbuffer, uv - epsilon.xz ).z;
	normal.y     = texture2D(renderbuffer, uv + epsilon.zy ).z - texture2D(renderbuffer, uv - epsilon.zy ).z;
	return normalize(normal);
}
//// END ENVIRONMENT FUNCTIONS




//// ANGLES
//maps a normalized 2d vector to a 0-1 float on a radial gradient
float vector_to_angle( vec2 v )
{
	return fract( atan( v.x, v.y ) / TAU ) ;
}


//converts an angle to a normalized 2D vector
vec2 angle_to_vector(float a)
{
	vec2 v = vec2(a, a) * TAU;
	return normalize(vec2(cos(v.x),sin(v.y))).yx;
}


//mix two angles without having the problem of flipping back and forth near the 0-1 boundary - can be refactored to something better
float mix_angle( float angle, float target, float rate )
{    
	angle = abs( angle - target - 1. ) < abs( angle + target ) ? angle - 1. : angle;
	angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
	return clamp_angle(fract(mix(angle, target, rate)));
}


//reflect an angle off a surface normal
float reflect_angle(float incident, float normal)
{
	return fract(abs(normal)*2.-incident-.5);
}


//returns a normalized vector from the current screen pixel to the mouse position
float angle_to_mouse(vec2 uv)
{
 	vec2 position   = format_to_screen( uv );
 	vec2 mouse_pos  = format_to_screen( mouse );
 	vec2 v          = mouse_pos - position;
 	return vector_to_angle( v );
}
//// END ANGLES




//// CELL SPAWNING
//spawn a cell from center with a random vector
float add_at_position( float probability, float angle, vec2 position )
{
	bool spawn   = floor( gl_FragCoord.x) == floor( resolution.x * position.x ) && floor( gl_FragCoord.y ) == floor( resolution.y * position.y );
	spawn        = spawn && position_hash( position * rmat( time ) ) < probability;
	return spawn ? angle : 0.;
}


//spawn a particle from a random position with a random vector 
float add_at_random( float probability, float angle )
{
	vec2 position = gl_FragCoord.xy / resolution.xy;
	bool spawn    = position_hash( position * rmat( time ) ) < probability * .01;
	return spawn ? angle : 0.;
}
//// END CELL SPAWNING




//// FORMATTING
//centers coordinates and corrects aspect ratio for the screen
vec2 format_to_screen( vec2 p )
{
	p       = p * 2. - 1.;
	p.x     *= resolution.x / resolution.y;
	return p;
}


//clamps to +-1./256. for the 8 bit buffer
float clamp_angle(float angle)
{
	return clamp(angle, .00390625, 1.);    
}


//takes a positonal offset and creates the neighbor uv position wrapped around the space
vec2 wrap_and_offset_uv(vec2 uv, vec2 offset)
{
	offset *= mouse.x < .02 ? -1. : 1.; //reverse on mouse at left side of screen - email me if you "fix" the reversal   
	uv = fract((gl_FragCoord.xy + offset)/resolution);
	return uv;
}


//this masks out screen edges to prevent wrapping (in case you don't want that)
float mask_screen_edges( float width )
{
	return  gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width ? 0. : 1.;    
}
////END SCREEN FORMATTING




//// HASHES
//cheap hashes used for non deterministic stuff (spawning,etc)

//returns a psudo-random 0-.9999999 number
float hash( float x )
{
	const float modulus = 1234.56789;
	x = x * modulus;
	return fract( fract( x ) + x );
}


//returns a hash from uv coordinates
float position_hash( vec2 uv )
{
	return hash( uv.x + hash( uv.y + hash( -uv.y + hash( uv.x ))));
}


//returns a hash of position and time inputs
float time_position_hash( vec2 uv )
{
	return position_hash( uv * rmat(time) );
}


//2d rotation matrix
mat2 rmat(float theta)
{
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c,s,-s,c);
}
//// END HASHES




//// MAP FUNCTIONS
//lens shapes
float lens(vec2 position)
{
	vec2 p = position;
 //   p *= rmat(time*.125);
	float s = length(p)-.5;
	float n = fbm(.475, 5., p+9., 3);
    
	vec2 o  	= vec2(-.75, 0.);
	vec2 lp		= abs((p-o)*vec2(1., .75));
	float l		= length(lp+vec2(.5, 0.))-.6;
	l 		= step(l, .0)*(.125-l);
	l		= l*l*(3.-2.*l);

	return l;
}


float distorted_lens(vec2 position)
{
	vec2 p = position;
 //   p *= rmat(time*.125);
	float s = length(p)-.5;
	float n = fbm(.475, 5., p+9., 3);
    
	vec2 o  	= vec2(-.0, 0.);
	vec2 lp		= abs((p-o)*vec2(1., .75));
	float l		= length(lp+vec2(.5, 0.))-.6;
	l 		= step(l, .0)*(.125-l);
	l		= l*l*(3.-2.*l);

	return l;
}


//value noise
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


//fractal brownian motion
float fbm(float a, float f, vec2 uv, const int it)
{
    float n = 0.;
    uv = (32.5 + uv) * rmat(.61);
    vec2 p = vec2(.3, .7);
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
///// END MAP FUNCTIONS