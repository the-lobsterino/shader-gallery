#ifdef GL_ES
precision highp float;
#endif

//// HEADER
#define TAU    (8.*atan(1.))
#define PI     (4.*atan(1.))

//uniform vec2      mouse;
varying vec2 surfacePosition;
uniform float     time;
#define time ((.5*time+length(surfacePosition))*3.)
#define mouse vec2(0.5+sin(time/2.)/4., 0.5+sin(time)/4.)
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
float  cross(float x);
float  convolute(float x);

//screen formatting
vec2   format_to_screen( vec2 uv );
float  mask_screen_edges( float width );

//map functions
float  map(vec2 position);
vec2   derive(vec2 position, float offset);
vec2   derive_prior(vec2 uv, float offset);
float  box(vec2 p, vec2 s);
mat2   rmat(float t);
float  kali(vec2 p, vec3 c, float r, int it);
float  lens(vec2 position);
float  distorted_lens(vec2 position);
vec2   smooth(vec2 uv);
float  value_noise(in vec2 uv);
float  fbm(float a, float f, vec2 uv, const int it);


#define FLUID_VISCOSITY		(gl_FragCoord.x/resolution.x)
#define FLUID_COMPRESSION	((gl_FragCoord.y/resolution.y)*.1)
#define WRAP

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
	
	vec4 cell 		= vec4( 0. );
	bool alive 		= false;
	vec4 prior_cell		= texture2D(renderbuffer, uv);
	
	vec4 lapacian 		= (2.0 * prior_cell - 1.0);
	
	vec4 prior_wave		= lapacian;
	float wave_angle	= prior_cell.x;
	float wave_max		= 0.;
	
	for ( int j = 0; j < 4; j++)
	{
		
		for ( int i = 0; i < 8; i++ )
    		{
			float weight 		= mod(float(i), 2.) == 1. ? .2 : .05;
		
			vec2 neighbor_uv 	= fract(uv + neighbor_offset[i] * (prior_cell.w * 4.-float(j))/resolution);
		
			vec4 neighbor_cell 	= texture2D(renderbuffer, neighbor_uv); 
		
		
		
			lapacian 		-= weight * (2. * neighbor_cell - 1.) * .25;
			wave_max		= neighbor_cell.y >= wave_max ? neighbor_cell.y : wave_max;
			wave_angle 		= wave_max == neighbor_cell.y ? mod(float(i-4), 8.) * .125 : wave_angle;
		}
	}
    
	#ifndef WRAP
	//mask the screen edges so particles dont wrap if wrapping is not defined
	cell.w *= mask_screen_edges(1.);
	#endif

	vec2 position           = format_to_screen(uv);
        float collision         = map(position);
	
	prior_wave.yz 		= mix(prior_wave.yz, prior_wave.zy, abs(lapacian.yz-lapacian.zy) * -FLUID_COMPRESSION) - floor(collision*32.);
	

	float prior		= prior_wave.z - lapacian.y  * FLUID_VISCOSITY;
	float current		= prior_wave.y + (prior_wave.z - lapacian.y) * FLUID_VISCOSITY;
	
	float dist_to_mouse	= length(format_to_screen(uv)-format_to_screen(mouse));
	
	if (dist_to_mouse > .01)
	{
		cell.yz = vec2(current, prior) * .99;
		cell.xw += wave_angle;
	}
	else
	{
		cell.xyz = vec3(1.);				
	}

	cell.yz = cell.yz * .5 + .5;
	cell.yz = cell.z == 0. ? vec2(.5) : cell.yz;

	cell.x = fract(cell.x);	
	cell.w = mix(prior_cell.w, cell.y, .125);
	//reset on mouse in corner
	cell *= float( mouse.x + mouse.y > .02 );
	
	gl_FragColor = cell;
}//sphinx
//// END MAIN




//// ENVIRONMENT FUNCTIONS
//function map (a heightfield)
float  map(vec2 position)
{
	float n = fbm(.5, 2., position, 3);
	float m = step(length(position - format_to_screen(mouse)),.01);
	float k = kali(position, vec3(1.5, 1., 1.), .5, 9);

	return max(0., k*1.5);
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


//2d rotation matrix
mat2 rmat(float theta)
{
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c,s,-s,c);
}

float cross(float x)
{
	return abs(fract(x-.5)-.5)*2.;	
}

float convolute(float x)
{
	x = 4. * (x * (1.-x));
	return x*x;
}

float kali(vec2 p, vec3 c, float r, int it)
{
    mat2 rot = rmat(r);
    rot     *= c.x;
    for (int i = 0; i < 64; i++)
    {
        if(i < it)
        {
            p   *= rot;
            p   /= dot(p,p);
            p    = abs(p)-c.x;
            c.z *= c.x;
        }
        else
        {
            break;
        }
    }
    
    return (length(p)-c.y)/c.z;
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