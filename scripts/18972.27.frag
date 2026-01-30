#ifdef GL_ES
precision mediump float;
#endif

//in progress...

#define PI (4./atan(1.))

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

float	clear_buffer_on_mouse_in_corner();
vec2 	format_to_screen( vec2 p );

float	line(vec2 p, vec2 a, vec2 b, float w);

float	hash( float x );
float	mod289(float x);
vec2	smooth(vec2 uv);
float	noise(in vec2 uv);
float	fbm(float a, float f, in vec2 uv, const int it);

vec3	hsv(in float h, in float s, in float v);

float	butterfly_line( float row, float column, float offset, vec2 cell_uv, vec2 cell_offset, vec2 uv);
void	set_butterfly_array(float stage, inout float butterfly[8]);


//mix two angles without having the problem of flipping back and forth near the 0-1 boundary - can be refactored to something better
float mix_angle( float angle, float target, float rate )
{    
    angle = abs( angle - target - 1. ) < abs( angle - target ) ? angle - 1. : angle;
    angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
    return (fract(mix(angle, target, rate)));
}


vec4 	butterfly(vec2 cell_uv, vec2 cell, vec4 current_sample, float swizzle[8], vec4 result)
{
	vec4 mul_sample	  = vec4(0.);
	vec4 add_sample   = vec4(0.);
	
	for(int i = 0; i < 8; i++)
	{
		if(cell.y == float(i))
		{
			mul_sample	= texture2D(renderbuffer, vec2(cell_uv.x+1./resolution.x, swizzle[i]/7.));
			add_sample	= texture2D(renderbuffer, vec2(cell_uv.x+1./resolution.x, float(i)));
		}
	}
	
	add_sample.w	= abs(current_sample.w - add_sample.w); 
	mul_sample.w	= fract(current_sample.w * mul_sample.w);
	result.w	+= abs(sqrt(add_sample.w)-sqrt(mul_sample.w));
	result.xyz	= mix(current_sample.xyz, .5*(mul_sample.xyz+add_sample.xyz), 1.-result.w*.5);
	return result;
}



void main( void ) {

	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	
	vec2 dimensions		= vec2(8., 8.);
	vec2 cell 		= floor(uv * dimensions);
	vec2 cell_offset	= .5/dimensions;
	vec2 cell_uv		= 1./dimensions;
	
	vec2 screen_uv 		= format_to_screen(uv);
	vec2 screen_cell	= cell_uv;
	
	vec2 graph_uv 		= fract(uv * dimensions);
	vec4 graph 		= vec4(0.);
	
	
	float stage		= cell.x;
	
	vec2 mouse_cell 	= floor(mouse * dimensions);
	float cursor		= float(mouse_cell.x == cell.x && mouse_cell.y == cell.y && stage < 2.);
	float cursor_point	= step(length(screen_uv-floor((format_to_screen(mouse))*dimensions)/dimensions),.05);

	
	float t 		= -time;
	
	//sin clamped to 01 range
	float raw_signal_in	= normalize(vec2(sin(graph_uv.x + t * .5), 2.)).x + .5;
	
	float noise		= (fbm(.5, 2., graph_uv.xx + t * .5 , 8));
	raw_signal_in		= noise;
	
	
	float tangent 		= fract(graph_uv.x * cell.y + t * cell.y);
	tangent 		= tangent*(1.-tangent);;
	tangent 		*= tangent;
	tangent 		= (tangent*8.);

	//tangent 		= normalize(vec2(sin(graph_uv.x * cell.y + t * cell.y * 4.), 2.)).x + .5;
	
	float signal_in 	= texture2D(renderbuffer, vec2(cell_offset.x*2., cell.y+cell_offset.y)).w;
	
	signal_in		= abs(signal_in-tangent);

	vec4 result 		= vec4(0.);
	
	float lines 		= 0.;

	float swizzle[8];
	
	//simulated signal
	if(stage == 0.)
	{
		result += clamp(raw_signal_in, 0., 1.);	
	}
	
	vec4 current_sample = texture2D(renderbuffer, uv);
	vec3 color = hsv((cell.y/dimensions.y)*.91, 1., 1.);
	//butterfly swizzle
	if(stage == 1.)
	{
		swizzle[0] = 0.;
		swizzle[1] = 4.;
		swizzle[2] = 2.;
		swizzle[3] = 6.;
		swizzle[4] = 1.;
		swizzle[5] = 5.;
		swizzle[6] = 3.;
		swizzle[7] = 7.;

		//input signal
		for(int i = 0; i < 8; i++)
		{
			result.xyz	= color;
			result.w	= signal_in;
		}	
	}
	else if(stage == 2.) 
	{
		swizzle[0] = 0.;
		swizzle[1] = 4.;
		swizzle[2] = 2.;
		swizzle[3] = 6.;
		swizzle[4] = 1.;
		swizzle[5] = 5.;
		swizzle[6] = 3.;
		swizzle[7] = 7.;	
		result = butterfly(cell_uv, cell, current_sample, swizzle, result);
	}
	else if(stage == 3.)
	{
		swizzle[0] = 4.;
		swizzle[1] = 0.;
		swizzle[2] = 6.;
		swizzle[3] = 2.;
		swizzle[4] = 5.;
		swizzle[5] = 1.;
		swizzle[6] = 7.;
		swizzle[7] = 3.;
		result = butterfly(cell_uv, cell, current_sample, swizzle, result);
	}
	else if(stage == 4.)
	{
		swizzle[0] = 6.;
		swizzle[1] = 2.;
		swizzle[2] = 4.;
		swizzle[3] = 0.;
		swizzle[4] = 7.;
		swizzle[5] = 3.;
		swizzle[6] = 5.;
		swizzle[7] = 1.;
		result = butterfly(cell_uv, cell, current_sample, swizzle, result);
	}
	else if(stage == 5.)
	{
		swizzle[0] = 7.;
		swizzle[1] = 3.;
		swizzle[2] = 5.;
		swizzle[3] = 1.;
		swizzle[4] = 6.;
		swizzle[5] = 2.;
		swizzle[6] = 4.;
		swizzle[7] = 0.;
		result = butterfly(cell_uv, cell, current_sample, swizzle, result);
	}
	if(stage == 6.)
	{
		swizzle[0] = 0.;
		swizzle[1] = 1.;
		swizzle[2] = 2.;
		swizzle[3] = 3.;
		swizzle[4] = 4.;
		swizzle[5] = 5.;
		swizzle[6] = 6.;
		swizzle[7] = 7.;
		result = butterfly(cell_uv, cell, current_sample, swizzle, result);
	}
	else if(stage == 7.)
	{
		swizzle[0] = 0.;
		swizzle[1] = 1.;
		swizzle[2] = 2.;
		swizzle[3] = 3.;
		swizzle[4] = 4.;
		swizzle[5] = 5.;
		swizzle[6] = 6.;
		swizzle[7] = 7.;
		result = .5-mix(current_sample, result, .5);
		result = mix(result, abs(texture2D(renderbuffer, vec2(cell_uv.x-1./resolution.x, 1./cell.y))-result.w)*.75+.25, .95);

	}
	
	//draw butterfly swizzle lines
	swizzle[0] = 0.;
	swizzle[1] = 4.;
	swizzle[2] = 2.;
	swizzle[3] = 6.;
	swizzle[4] = 1.;
	swizzle[5] = 5.;
	swizzle[6] = 3.;
	swizzle[7] = 7.;
	for(int i = 0; i < 8; i++)
	{
		
		cell_uv.y = cell_uv.y * (1.+(signal_in-.5)*.0125);
		lines = max(lines, butterfly_line( float(i), 0., 0., 				     cell_uv, cell_offset, screen_uv));	
		lines = max(lines, butterfly_line( float(i), 1., swizzle[i]-float(i), 		     cell_uv, cell_offset, screen_uv));
		lines = max(lines, butterfly_line( float(i), 2., mod(float(i), 2.) == 0. ? 1. : -1., cell_uv, cell_offset, screen_uv));
		lines = max(lines, butterfly_line( float(i), 3., mod(float(i), 4.) >= 2. ? -2. : 2., cell_uv, cell_offset, screen_uv));
		lines = max(lines, butterfly_line( float(i), 4., float(i) >= 4. ? -4. : 4.,	     cell_uv, cell_offset, screen_uv));
		lines = max(lines, butterfly_line( float(i), 5., 0.,				     cell_uv, cell_offset, screen_uv));
	}
	
	
	
	//plot signal
	float signal_plot 	= float(0.);
	if(stage == 0.)
	{
		signal_plot	= smoothstep(.975, smoothstep(.0, raw_signal_in - graph_uv.y, .025), 1.);
		result.xyz 	+= signal_plot * color;	
	}
	if(stage > 0.)
	{
		signal_plot	= smoothstep(.975, smoothstep(.0, abs(signal_in-raw_signal_in) - graph_uv.y, .025), 1.);
		result.xyz 	+= result.x + result.y + result.z < 0.15 ? signal_plot : 0.;	
	}
	
	
	result.xyz	*= mouse_cell.y == cell.y && mouse_cell.x < 1. ? vec3(0.) + signal_plot * (.5 + color) : result.xyz;
	result 		= lines > 0. 				? result + lines * .95 : result;
	result 		= mouse.x + mouse.y < .05 ? vec4(0.) : result;
	
	
	gl_FragColor = result;
}//sphinx


float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(1.-w, smoothstep(.0,  l.x+l.y, w), 1.);
}

float butterfly_line( float row, float column, float offset, vec2 cell_uv, vec2 cell_offset, vec2 uv)
{
	float width	= .005;
	vec2 a 		= vec2(column, row);
	vec2 b 		= vec2(column + 1., row + offset);
	a 		= format_to_screen(a * cell_uv + cell_offset);
	b 		= format_to_screen(b * cell_uv + cell_offset);
	return line(uv, a, b, width);
}

//returns a psudo-random 0-.9999999 number
float hash( float x )
{
	x = mod(x, 1234.5678);
	return fract(x-atan((x*1234.56789),(x*9182.736354)));
}

//smoothing curve
vec2 smooth(vec2 uv) 
{
	return uv*uv*(3.-2.*uv);
}


//value noise - 2d smooth random noise at single frequency
float noise(in vec2 uv) 
{
	 float k = 257.;
	vec4 l  = vec4(floor(uv),fract(uv));
	float u = l.x + l.y * k;
	vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
	v       = vec4(hash(v.x), hash(v.y), hash(v.z), hash(v.w));
	l.zw    = smooth(l.zw);
	l.x     = mix(v.x, v.y, l.z);
	l.y     = mix(v.z, v.w, l.z);
	return    mix(l.x, l.y, l.w);
}


//fractal brownian motion - 2D pink noise - combines multiple noise frequencies into a harmonic
float fbm(float a, float f, in vec2 uv, const int it)
{
	float n = 0.;
//	float s = 32.99;
	//mat2 rmat = mat2(cos(s),sin(s),-sin(s),cos(s));
//	vec2 t = uv * rmat;
	for(int i = 0; i < 32; i++)
	{
        	if(i<it)
	        {
        	    n += noise(uv*f)*a;
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

//centers coordinates and corrects aspect ratio for the screen
vec2 format_to_screen( vec2 p )
{
    p       = p * 2. - 1.;
    p.x     *= resolution.x / resolution.y;
    return p;
}

vec3 hsv(in float h, in float s, in float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float clear_buffer_on_mouse_in_corner()
{
	return mouse.x + mouse.y < .05 ? 0. : 1.;    
}


void set_butterfly_array(float stage, inout float butterfly[8])
{
	if(stage == 1.)
	{
		butterfly[0] = 0.;
		butterfly[1] = 4.;
		butterfly[2] = 2.;
		butterfly[3] = 6.;
		butterfly[4] = 1.;
		butterfly[5] = 5.;
		butterfly[6] = 3.;
		butterfly[7] = 7.;			
	}
	if(stage == 2.)
	{
		butterfly[0] = 0.;
		butterfly[1] = 4.;
		butterfly[2] = 2.;
		butterfly[3] = 6.;
		butterfly[4] = 1.;
		butterfly[5] = 5.;
		butterfly[6] = 3.;
		butterfly[7] = 7.;	
	}
	if(stage == 3.)
	{
		butterfly[0] = 4.;
		butterfly[1] = 0.;
		butterfly[2] = 6.;
		butterfly[3] = 2.;
		butterfly[4] = 5.;
		butterfly[5] = 1.;
		butterfly[6] = 7.;
		butterfly[7] = 3.;
	}
	if(stage == 4.)
	{
		butterfly[0] = 6.;
		butterfly[1] = 2.;
		butterfly[2] = 4.;
		butterfly[3] = 0.;
		butterfly[4] = 7.;
		butterfly[5] = 3.;
		butterfly[6] = 5.;
		butterfly[7] = 1.;
	}
	if(stage == 5.)
	{
		butterfly[0] = 7.;
		butterfly[1] = 3.;
		butterfly[2] = 5.;
		butterfly[3] = 1.;
		butterfly[4] = 6.;
		butterfly[5] = 2.;
		butterfly[6] = 4.;
		butterfly[7] = 0.;
	}
	else
	{
		butterfly[0] = 0.;
		butterfly[1] = 1.;
		butterfly[2] = 2.;
		butterfly[3] = 3.;
		butterfly[4] = 4.;
		butterfly[5] = 5.;
		butterfly[6] = 6.;
		butterfly[7] = 7.;
	}
}