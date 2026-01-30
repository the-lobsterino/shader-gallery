#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;
uniform float time;

vec2	format_to_screen(vec2 uv);
float	vector_to_angle(vec2 v);
float	angle_to_mouse();
vec3	hsv(in float h, in float s, in float v);

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	float scale 	= 1.;
	vec2 p		= format_to_screen(uv) * scale;
	vec2 m		= format_to_screen(mouse) * scale;	
   	
	vec4 buffer	= texture2D(renderbuffer, uv);
	

	float m_angle	= angle_to_mouse();
	float center	= vector_to_angle(-p); //center of screen
	float buf_angle = buffer.w;            //crazy times!

	float angle 	= center;
	//angle		= fract(m_angle-center);	
    	angle 		= fract(.125 * angle - buf_angle - .000001);
	
	float axis	= min(angle, fract(angle-.5));    

	
	axis		= axis < .125 || axis > .375 ? abs(uv.y - .5 * resolution.y) : uv.x * resolution.x/resolution.y;

			
	float theta	= mod(axis * 256., .125);
	theta		= fract(angle + theta);    
	
    	vec4 result	= vec4(theta);
	//result		= vec4(hsv(theta*.625, 1.,1.), theta);

	result 		= mouse.x + mouse.y < .02 ? vec4(0.) : result;
	
	gl_FragColor	= result;
}

vec2 format_to_screen( vec2 p )
{
	p       = p * 2. - 1.;
	p.x     *= resolution.x / resolution.y;
	return p;
}

float vector_to_angle( vec2 v )
{
	return fract( atan( v.x, v.y ) / (8. * atan(1.)) ) ;
}

//returns a normalized vector from the current screen pixel to the mouse position
float angle_to_mouse()
{
	vec2 position   = format_to_screen( gl_FragCoord.xy / resolution.xy );
	vec2 mouse_pos  = format_to_screen( mouse );
	vec2 v          = mouse_pos - position;
	return vector_to_angle( v );
}

vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}