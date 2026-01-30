#ifdef GL_ES
precision mediump float;
#endif

//pew pew!

uniform float		time;
uniform vec2 		mouse;
uniform vec2		resolution;
uniform sampler2D	renderbuffer;

#define TAU (8.*atan(1.))

vec2 format_to_screen( vec2 p );
float clamp_angle(float angle);
float angle_to_mouse();
float vector_to_angle( vec2 v );
vec2 angle_to_vector(float a);
float mix_angle( float angle, float target, float rate );
float reflect_angle(float incident, float normal);
float mask_screen_edges( float width );
float hash(float x);
vec4 expand(vec4 v);
vec4 compact(vec4 v);

const float mouseChromaPrecision = 1./450.;
vec2 VMouseGet(void){
	vec2 oldMouse = texture2D(renderbuffer, vec2(0.)).xy;
	float time = time * 0.3;
	vec2 mouse = mouse + 0.1*vec2(sin(time), cos(pow(time, 0.123)+time*3.));
	if(mouse.x > oldMouse.x){
		oldMouse.x += mouseChromaPrecision;
	}else if(mouse.x < oldMouse.x){
		oldMouse.x -= mouseChromaPrecision;
	}
	if(mouse.y > oldMouse.y){
		oldMouse.y += mouseChromaPrecision;
	}else if(mouse.y < oldMouse.y){
		oldMouse.y -= mouseChromaPrecision;
	}
	return oldMouse;
}
void VMousePut(vec2 inpOldVMouse){
	if(gl_FragCoord.x + gl_FragCoord.y < 5.){
		gl_FragColor.x = inpOldVMouse.x;
		gl_FragColor.y = inpOldVMouse.y;
	}else if(gl_FragCoord.x + gl_FragCoord.y < 10.){
		
		gl_FragColor = vec4(0.);
	}
}

void main() 
{   
	//normalized screen coordinate
	vec2 mouse = VMouseGet();
	vec2 uv  		= gl_FragCoord.xy / resolution.xy;  
	vec2 position		= format_to_screen(uv);
	vec2 m_position 	= format_to_screen(mouse);
	
	vec4 prior_sample	= texture2D(renderbuffer, uv);	
	vec4 lapacian 		= expand(prior_sample);
	vec4 prior_wave		= lapacian;

    	vec2 neighbor_offset[8]; 
    	neighbor_offset[0] = vec2(  0., -1. );
    	neighbor_offset[1] = vec2( -1., -1. );
    	neighbor_offset[2] = vec2( -1.,  0. );
	neighbor_offset[3] = vec2( -1.,  1. );
	neighbor_offset[4] = vec2(  0.,  1. );
	neighbor_offset[5] = vec2(  1.,  1. );
	neighbor_offset[6] = vec2(  1.,  0. );
	neighbor_offset[7] = vec2(  1., -1. );

	vec4 neighbor[8]; 
	
      
	for ( int i = 0; i < 8; i++ )
    	{
		float c = 4.-(3.-prior_sample.z-prior_sample.w)-.5*(prior_sample.x+prior_sample.y);
		c = pow(1.51*c, 1.51);

		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i] * c)/resolution);
		neighbor[i]	 	= texture2D(renderbuffer, neighbor_uv); 
	}
	
	for(int i = 0; i < 8; i++)
	{
		float weight 		= mod(float(i), 2.) == 1. ? .2 : .05;
		lapacian 		-= weight * expand(neighbor[i]);		
	}
	
	#define CELERITY .5 //wave speed
	#define THIS_THING_WHATEVER_IT_IS	-.15
	
	float prior		= prior_wave.z - lapacian.y  * CELERITY;
	float current		= prior_wave.y + prior;
	vec2 wave		= vec2(current, prior);
	wave 			= mix(wave.xy, wave.yx, abs(lapacian.yz-lapacian.zy) * THIS_THING_WHATEVER_IT_IS);
	
	prior			= prior_wave.w - lapacian.x  * CELERITY;
	current			= prior_wave.x + prior;
	vec2 group		= vec2(current, prior);
	group 			= mix(group.xy, group.yx, abs(lapacian.xw-lapacian.wx) * THIS_THING_WHATEVER_IT_IS);
	
	//wave 
	vec4 result		= vec4(0.);
	result.yz 		= wave * .5 + .5;
	result.xw 		= group * .5 + .5;

	result			= mix(result, prior_sample, .75) * .9975;			      

	//cursor input
	result 			= length(position-m_position) < 4./resolution.x ? vec4(1.) : result;
	
	//reset on mouse in bottom left corner, or when first loaded
	result 			= mouse.y > .98 || time < 1. ? vec4(.5,0., .5, .0) : result;
        
	//prevent wrapping
	result *= mask_screen_edges(1.);
	
	
	
	gl_FragColor = result;
	VMousePut(mouse);
}//sphinx


//formats and centers uv to screenspace
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


//returns a psudo-random 0-.9999999 number
float hash( float x )
{
    x *= 1234.56789;
    return fract( fract( x ) + x );
}

vec4 expand(vec4 v)
{
	return v * 2. - 1.;
}

vec4 compact(vec4 v)
{
	return (v + 1.) * .5;
}

//returns a normalized vector from the current screen pixel to the mouse position
float angle_to_mouse()
{
    vec2 position   = format_to_screen( gl_FragCoord.xy / resolution.xy );
    vec2 mouse_pos  = format_to_screen( mouse );
    vec2 v          = mouse_pos - position;
    return vector_to_angle( v );
}

float vector_to_angle( vec2 v )
{
    return fract( atan( v.x, v.y ) / TAU ) ;
}


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

//this masks out screen edges to prevent wrapping (in case you don't want that)
float mask_screen_edges( float width )
{
    return  gl_FragCoord.x < width || gl_FragCoord.x > resolution.x - width || gl_FragCoord.y < width || gl_FragCoord.y > resolution.y - width ? 0. : 1.;    
}