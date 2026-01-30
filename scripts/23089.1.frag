#ifdef GL_ES
precision mediump float;
#endif

//pew pew!

// laptop didn't like the neighbor arrays. this makes it work
// mesa 10.3.5 on linux 3.19 builtin driver for radeon 4100 (880M)

//screensaver mode
//mouse controls "wind" direction, nice idea!
//now with bicubic sampling for smoothness at sub-texel offsets

//rearrange colors: name your swizzle pattern, rgba = original
//first vec2 is activity (highlight) and second vec2 is history (background)
#define SWIZ rgba
//#define SWIZ grab
//#define SWIZ garb
//#define SWIZ brga
//#define SWIZ barg
//#define SWIZ gbra

uniform float		time;
uniform vec2 		mouse;
uniform vec2		resolution;
uniform sampler2D	renderbuffer;

#define TAU 6.28318530

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
vec2 neighbor_offset(int i);
vec4 texture2D_bicubic(sampler2D tex, vec2 uv);

void main() 
{   
	//normalized screen coordinate
	vec2 uv  		= gl_FragCoord.xy / resolution.xy;  
	vec2 position		= format_to_screen(uv);
	vec2 m_position 	= //format_to_screen(mouse);
				  format_to_screen(vec2(sin(time*0.02+120.)*sin(time*0.3+43.)*sin(time*cos(time*0.01)*0.1+88.),
							cos(time*0.07+24.)*cos(time*0.1+15.)*cos(time*sin(time*0.002)*0.03+72.))*0.5+0.5)*0.85;
	
	vec4 prior_sample	= texture2D(renderbuffer, uv).SWIZ;	
	vec4 lapacian 		= expand(prior_sample);
	vec4 prior_wave		= lapacian;
      
	for ( int i = 0; i < 8; i++ )
    	{
		float c = 4.-(3.-prior_sample.z-prior_sample.w)-.5*(prior_sample.x+prior_sample.y);
		c = pow(.781*c, 1.9);

		vec2 neighbor_uv 	= fract((gl_FragCoord.xy - neighbor_offset(i) * c)/resolution);
		float weight 		= mod(float(i), 2.) * .15 + .05;
		lapacian 		-= weight * expand(texture2D_bicubic(renderbuffer, neighbor_uv).SWIZ );		
	}
	
	#define CELERITY 1. //wave speed
	#define THIS_THING_WHATEVER_IT_IS	-.1
	
	float prior		= prior_wave.z - lapacian.y  * CELERITY;
	float current		= prior_wave.y + prior;
	vec2 wave		= vec2(current, prior);
	wave 			= mix(wave.xy, wave.yx, abs(lapacian.yz-lapacian.zy) * THIS_THING_WHATEVER_IT_IS);
	
	prior			= prior_wave.w - lapacian.x  * CELERITY;
	current			= prior_wave.x + prior;
	vec2 group		= vec2(current, prior);
	group 			= mix(group.xy, group.yx, abs(lapacian.xw-lapacian.wx) * THIS_THING_WHATEVER_IT_IS);
	
	//wave 
	vec4 result		= mix(vec4(group.x, wave.x, wave.y, group.y) * .5 + .5, prior_sample, vec4(.4, .4, .125, .125)) * .999;			      

	//cursor input
	//result 			= length(position-m_position) < .01 ? vec4(1.) : result;
	result += vec4(pow(0.01/length(position-m_position), 3.));
	
	//reset on mouse in bottom left corner, or when first loaded
	result 			= length(mouse) < .02 || time < 1. ? vec4(.5, 0., .5, .0) : result;
        
	//prevent wrapping
	result *= mask_screen_edges(1.);
	
	gl_FragColor.SWIZ = result;
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
    angle -= step(abs( angle + target ), abs( angle - target - 1. ));
    angle += step( abs( angle - target ), abs( angle - target + 1. ));
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
    return  step(width, gl_FragCoord.x) * 
	    step(gl_FragCoord.x, resolution.x - width) * 
	    step(width, gl_FragCoord.y) * 
	    step(gl_FragCoord.y, resolution.y - width);    
}

//recovers pattern of -1,0,1 for 8 surrounding texels
vec2 neighbor_offset(int i)
{
#define pattern(x) (step(0.12, x) * step(x, 0.495) - step(0.62, x) * step(x, 0.995))
    float a = float(i)*0.125;
    vec2 whoosh = mouse * 2. - 1.;
	whoosh = pow(whoosh,vec2(2.)) * sign(whoosh);
    return vec2(pattern(a), pattern(fract(a+0.25))) + whoosh;
#undef pattern(x)
}

#define MNB 1.0
#define MNC 0.0
float MNweights(float x)
{
	float ax = abs(x);
	return (ax < 1.0) ?
		(((12.0 - 9.0 * MNB - 6.0 * MNC) * ax + (-18.0 + 12.0 * MNB +
		6.0 * MNC)) * ax * ax + (6.0 - 2.0 * MNB)) / 6.0
	: ((ax >= 1.0) && (ax < 2.0)) ?
		((((-MNB - 6.0 * MNC) * ax + (6.0 * MNB + 30.0 * MNC)) * ax + 
		(-12.0 * MNB - 48.0 * MNC)) * ax + (8.0 * MNB + 24.0 * MNC)) / 6.0
	: 0.0;
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 fix = uv-vec2(0.5)/resolution; //remove diagonal offset
	vec2 px = (1.0 / resolution);
	vec2 f = fract(fix / px);
	vec2 texel = (fix / px - f + 0.5) * px;
	vec4 weights = vec4(MNweights(1.0 + f.x),
			    		MNweights(          f.x),
			    		MNweights(1.0 - f.x),
			   		 MNweights(2.0 - f.x));
	vec4 t1 = 
		texture2D(tex, texel + vec2(-px.x, -px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, -px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, -px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, -px.y)) * weights.w;
	vec4 t2 = 
		texture2D(tex, texel + vec2(-px.x, 0.0)) * weights.x +
		texture2D(tex, texel) /* + vec2(0.0) */ * weights.y +
		texture2D(tex, texel + vec2(px.x, 0.0)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 0.0)) * weights.w;
	vec4 t3 = 
		texture2D(tex, texel + vec2(-px.x, px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, px.y)) * weights.w;
	vec4 t4 = 
		texture2D(tex, texel + vec2(-px.x, 2.0 * px.y)) * weights.x +
		texture2D(tex, texel + vec2(0.0, 2.0 * px.y)) * weights.y +
		texture2D(tex, texel + vec2(px.x, 2.0 * px.y)) * weights.z +
		texture2D(tex, texel + vec2(2.0 * px.x, 2.0 * px.y)) * weights.w;
	
	return MNweights(1.0 + f.y) * t1 +
		MNweights(           f.y) * t2 +
		MNweights(1.0 - f.y) * t3 +
		MNweights(2.0 - f.y) * t4;
}
