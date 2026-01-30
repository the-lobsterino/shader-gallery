//just some experimenting with different paths over various functions
//mouse position changes the output patterns 

#ifdef GL_ES
precision highp float;
#endif
	

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;
uniform float     time;

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
float		mix_angle(float angle, float target, float rate);
float 		angle_to_mouse();
float 		mask_screen_edges(float pixel_width);

float 		map(vec2 p);
vec2 		derive(vec2 position, float offset);
vec2 		derive_prior(vec2 uv, float offset);
float 		value_noise(in vec2 uv); 
float 		box(vec2 p, vec2 s);
float 		value_noise(in vec2 uv);
float 		fbm(float a, float f, vec2 uv, const int it);
mat2 		rmat(float theta);

#define TAU 			(8.*atan(1.)) //2 pi


#define ADD_CELLS_CENTER	true
#define ADD_CELLS_MOUSE		false
#define ADD_CELLS_RANDOM	false
#define TRAILS			true
#define WRAP			false
#define DEBUG_SEQUENCE		false

float spiral(vec2 uv);

#define SEQUENCE_WORD_SIZE   255.

float sequence(float theta, vec2 uv)
{
	float phase	= min(theta, fract(theta-.5));    
	bool axis	= phase < .125 || phase > .375;
	float s		= axis ? spiral(uv) : spiral(-uv.yx);
	uv 		= uv_to_screen(uv);
	phase		= axis ? uv.y :  uv.x;
	
	float rotation	= mod(phase*SEQUENCE_WORD_SIZE, .125); 
	theta		= fract(theta+rotation-s);    
	
    	return theta;
}

//from : http://glslsandbox.com/e#25443.4
float spiral(vec2 uv)
{
    uv-=vec2(0.5,.5);
    uv.x*=.7;
    uv.y/=2.5;
    //-----------------------!!!!!!!!!!!-------------------|	
    float a=atan(uv.x,uv.y)/3.14;// or divide PI 
    float r=uv.y;
    r=.2/r;
    float c1=float(r<2.);
    float c2=float(r>.4);
    float c3=float(r<.38);

    a=mod(a,1.);
    r=mod(r,1.);
    float v=0.;
	float p=.5;
    for (int i=7;i>0;i--)
    {
        int m=0;
        if (a>p)
        {
        	m++;
            a-=p;
        }
        if (r>p)
        {
        	m++;
            r-=p;
        }
        if (m!=1)v+=p;
        p/=2.;
    }
    vec4 f = vec4(mod(v*8.,1.),mod(v*4.,1.),mod(v,2.),0);
    return (mod(v*8.,1.)+mod(v*4.,1.)+mod(v,2.))/8.;
}


void main( void ) 
{   
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	//assign prior pixel to automata struct (for handling collisions and making trails)
	automata cell 	= read(texture2D(renderbuffer, uv));
	


	automata prior  = cell;
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

	float f = map(uv);
	
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
	
	if(cell.alive)
	{
		float normal = vector_to_angle(-derive(uv, .001));
		float s = mouse.x;
		cell.angle = mix_angle(cell.angle, mix_angle(cell.angle, normal, s), s);
	}
	
	//trails
	if(TRAILS)
	{
		cell.trail.x = cell.alive ? float(cell.alive) : cell.trail.x - .005;
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
		cell.trail 	=  cell.alive ? vec2(1., 1.) : cell.trail - vec2(.25, 0.);
	}

	cell.trail.y 	= f * (1.-mouse.x);
	
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


//2d rotation matrix
mat2 rmat(float theta)
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c,s,-s,c);
}
	
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
    return position_hash(uv * rmat(time));
}

automata add(automata cell)
{
	bool mouse_pixel 	= floor(mouse * resolution) == floor(gl_FragCoord.xy) && ADD_CELLS_MOUSE;
	bool center_pixel 	= floor(resolution *	.5) == floor(gl_FragCoord.xy) && ADD_CELLS_CENTER;
	bool random_pixel 	= time_position_hash( gl_FragCoord.xy/resolution.xy ) > .01 && ADD_CELLS_RANDOM;
	
	if(center_pixel )
	{
		cell.angle		= time_position_hash(gl_FragCoord.xy/resolution.xy);;//fract(cell.angle + 1./256.);
		cell.collision		= 0.;
		cell.trail		= vec2(.5, .75);
		cell.alive 		= true;
	}
	else if(mouse_pixel)
	{
		cell.angle		= time_position_hash(gl_FragCoord.xy/resolution.xy);//time_position_hash(gl_FragCoord.xy/resolution.xy);
		cell.collision		= 0.;
		cell.trail		= vec2(.5, .0);
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

float mix_angle( float angle, float target, float rate )
{    
    angle = abs( angle - target - 1. ) < abs( angle + target ) ? angle - 1. : angle;
    angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
    return fract(mix(angle, target, rate));
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

float map(vec2 p)
{
	return spiral(p);// fbm(.5, 2., p + 2., 8) * 2. - 1.;	
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

float box(vec2 p, vec2 s)
{
	vec2 d = abs(p) - s;
  	return min(max(d.x, d.y), 0.0) + length(max(d, vec2(0.)));
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
