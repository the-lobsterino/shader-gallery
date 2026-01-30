#ifdef GL_ES
precision mediump float;
#endif


#define be sure to set the resolution to .5 in the top left pulldown

//relationships between waves, integers, and binary
//this function drives the automata system seen here : http://glslsandbox.com/e#21473.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform vec2 mousetravel;

float counter(float s, float n, vec2 p);
float extract_bit(float n, float b);
float sprite(float n, float w, float h, vec2 p);
float bit_row(float bit, float scale, vec2 p);
float digit(float num, vec2 p);
float sample(vec2 p, float f);
float convolute(float x);
float line(vec2 p, vec2 a, vec2 b, float w);
vec2  format_to_screen(vec2 p);
vec2  format_screen(vec2 uv);

#define FREQUENCIES 32
#define PI (4.*atan(1.))
void main( void ) 
{
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	uv 			= format_screen(uv);
	float m 		= clamp(mouse.y*2., 0., 1.);
	
	

	//line graph of samples at different frequencies
	//(1./n, with n being integer values between samples)
	float frequency	 	= float(FREQUENCIES);
	float frequencies 	= max(0., floor(frequency));
	float band		= floor(uv.y * frequencies);	
	
	float x			= uv.x * frequencies;
	float y			= fract(abs(uv.y) * frequencies);
	float sample_graph	= 0.; 
	float line_weight 	= .125;
	
	for(int i = 0; i < FREQUENCIES+1; i++)
	{	
		if(float(i) == band)
		{
			//frequency of samples from the center to the edge (0.-1.*frequencies)
			float samples		= mod(float(i)-frequencies*.5,frequencies)+frequencies*.5;
			float sample_resolution	= floor(x * samples);	
			
			//start
			float sample_start	= fract(samples * sample_resolution/frequencies);	
			float sample_end	= fract(sample_start + samples/frequencies); //the end sample is one period after the start
			
			//smoothing
			bool smooth = true;
			if(smooth)
			{
				
				sample_start 	= mix(sample_start, convolute(sample_start), m);
				sample_end 	= mix(sample_end, convolute(sample_end), m);
			}
			
			
			sample_graph 		= line(vec2(mod(x*samples, 1.), y * 1.5 - .25), vec2(0., sample_start), vec2(1.01, sample_end),  line_weight);				
		}
	}
	
	//graphy stuff
	float graph_mask 	= float(uv.x < .84);
	sample_graph 		*= graph_mask;
	
	//numbers
	vec2 pos_numbers 	= floor(vec2((uv.x * 512.), mod(uv.y * frequencies * 8., 8.)));
	float numbers 		= counter( 64431.0, band,  pos_numbers - vec2(492., 0.));
	
	
	//binary (black squares for 0, white squares for 1.)
	vec2 pos_binary 	= uv * vec2(64., 0.);
	float bits		= bit_row(band,   1., pos_binary - vec2(53.75, 0.));
	float grid_mask 	= float(x > 1.0 && x < 1.149);
	grid_mask 		*= float(mod(floor(uv.y*257.), 16.) == 0.) + float(mod(floor(uv.x * 512.), 8.) == 6.);
	bits			*= 1.-grid_mask;	

	vec4 result 		= vec4(bits + numbers + sample_graph);
	
	gl_FragColor 		= result;

}//sphinx 

//constants for text
float c_0 = 31599.0;
float c_1 = 9362.0;
float c_2 = 29671.0;
float c_3 = 29391.0;
float c_4 = 23497.0;
float c_5 = 31183.0;
float c_6 = 31215.0;
float c_7 = 29257.0;
float c_8 = 31727.0;
float c_9 = 31695.0;

float c_b = 64431.0;
float c_p = 64484.0;
float c_x = 23213.0;
float c_y = 23186.0;
float c_colon = 1040.0;

float counter(float s, float n, vec2 p)
{
	float c = 0.;
	vec2 cpos = vec2(5,1);	
	
	
	c += digit(n/100.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n/10.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n,floor(p-cpos));
		
	return c;
}

//format screen
vec2 format_screen(vec2 uv)
{
	if(mouse.x>.5)
	{
		//radial
		uv.x	*= resolution.x/resolution.y;
		float mystery_constant = 1.53;
		uv = vec2(length(uv), atan(uv.y, uv.x)/mystery_constant);
	}
	else
	{
		uv.y *= 1.03;
	}
	
	return uv;
}

//returns 0/1 based on the state of the given bit in the given number
float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

float sample(vec2 p, float l)
{
	p *= l;
	return p.x*.000125;
}

float sprite(float n, float w, float h, vec2 p)
{
	float bounds = float(all(lessThan(p,vec2(w,h))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n,(2.0 - p.x) + 3.0 * p.y) * bounds;
}

float bit_row(float bit, float scale, vec2 p)
{
	float r = 0.;
	float bounds = 0.;
	for(int i = 0; i < 8; i++)
	{
		bounds = float(all(lessThan(p, vec2(scale, scale))) && all(greaterThanEqual(p, vec2(0,0))));	
		r += extract_bit(bit, float(i)) * bounds;
		p.x -= scale;
	}
	return r;
}

float digit(float num, vec2 p)
{
	num = mod(floor(num),10.0);
	
	if(num == 0.0) return sprite(c_0, 3., 5., p);
	if(num == 1.0) return sprite(c_1, 3., 5., p);
	if(num == 2.0) return sprite(c_2, 3., 5., p);
	if(num == 3.0) return sprite(c_3, 3., 5., p);
	if(num == 4.0) return sprite(c_4, 3., 5., p);
	if(num == 5.0) return sprite(c_5, 3., 5., p);
	if(num == 6.0) return sprite(c_6, 3., 5., p);
	if(num == 7.0) return sprite(c_7, 3., 5., p);
	if(num == 8.0) return sprite(c_8, 3., 5., p);
	if(num == 9.0) return sprite(c_9, 3., 5., p);
	
	return 0.0;
}

//centers coordinates and corrects aspect ratio for the screen
vec2 format_to_screen(vec2 p)
{
    p       = p * 2. - 1.;
    p.x     *= resolution.x / resolution.y;
    return p;
}

//bresenham distance to line
float line(vec2 p, vec2 a, vec2 b, float w)
{
    if(a==b)return(0.);
    float d = distance(a, b);
    vec2  n = normalize(b - a);
    vec2  l = vec2(0.);
    l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
    l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
    return smoothstep(w, - .01, l.x + l.y);
}


float convolute(float x)
{
	x = 4. * (x * (1.-x));
	return x*x;
}