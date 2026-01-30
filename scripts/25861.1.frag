#ifdef GL_ES
precision mediump float;
#endif

//relationships between waves, integers, and binary

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

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

float counter(float s, float n, vec2 p);
float extract_bit(float n, float b);
float sprite(float n, float w, float h, vec2 p);
float bit_row(float bit, float scale, vec2 p);
float digit(float num, vec2 p);
float sample(vec2 p, float f);
vec2  format_to_screen(vec2 p);
float line(vec2 p, vec2 a, vec2 b, float w);
float cross(float x);
float convolute(float x);
		
#define FREQUENCIES 32

float hash(float v)
{
	return fract(fract(v*9876.5432)*(v+v)*12345.678);
}
void main( void ) 
{
	float scale		= 1.;
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	
	vec4 buffer		= uv.x < .6 ? texture2D(backbuffer, fract(uv * vec2(1.008, 1e8))) : vec4(0.);
	
	uv 			= uv * scale - .5 * scale;
	uv.x			*= resolution.x/resolution.y;
	uv.y			+= .5;
	//uv			= vec2(length(uv), abs(atan(uv.y, uv.x)));
	
	float frequency	 	= float(FREQUENCIES);
	float frequencies 	= max(0., floor(frequency));
	
//	float band		= floor(uv.y * frequencies) + time * mouse.y * 1e2;	
	float band		= floor(uv.y * frequencies) + hash(fract(time*.9)) * 655369. * mouse.y * 1e2;	
	
	//integer numbers
	vec2 pos_numbers 	= floor(vec2((uv.x * 192.), mod(uv.y * frequencies * 8., 8.)));
	float numbers 		= counter( c_b, band,  pos_numbers - vec2(32., 0.));
	
	//binary numbers (black squares for 0, white squares for 1.)
	vec2 pos_binary 	= uv * vec2(32., 0.);
	float bits		= bit_row(band,   1., pos_binary - vec2(-18., 0.));
	
	vec4 color		= vec4(1., 1., 1., 1.);
	vec4 result		= vec4(0.);
	result 			= vec4(bits + numbers);
	
	
	result			= mix(result, buffer.wwww, .95);

	uv 			= gl_FragCoord.xy/resolution.xy;
	result.xyz		*= step(result.w*uv.y*result.x, .022);
	result.xyz			+= mix(result.xyz, buffer.xyz, .4);	
	gl_FragColor 		= result;

}//sphinx 

float counter(float s, float n, vec2 p)
{
	float c = 0.;
	vec2 cpos = vec2(5,1);	
	
	c += digit(n/10000000.,floor(p-cpos));
	cpos.x += 4.;	
	c += digit(n/1000000.,floor(p-cpos));
	cpos.x += 4.;	
	c += digit(n/100000.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n/10000.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n/1000.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n/100.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n/10.,floor(p-cpos));
	cpos.x += 4.;
	c += digit(n,floor(p-cpos));
		
	return c;
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
	for(int i = 0; i < 24; i++)
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

float cross(float x)
{
	return abs(fract(x-.5)-.5)*2.;	
}

float convolute(float x)
{
	x = 4. * (x * (1.-x));
	return x*x;
}