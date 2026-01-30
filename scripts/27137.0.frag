#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//3x5 digit sprites stored in "15 bit" numbers
/*
███     111
  █     001
███  -> 111  -> 111001111100111 -> 29671
█       100
███     111
*/

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
float fpmod(float n);

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 p 		= uv * vec2(64,32);

	float period    = 256.;
   	float frequency = .05;
	
	float n 	= floor(mod(time * frequency, 1.) * period);
	
	float np 	= floor(fpmod(fract(time*frequency)));
	
	
	
	float bc 	= counter( c_b,   n, p + vec2( -2.5, 0.));	
	float br	= bit_row(  n,   3., p + vec2(-6., -6.5));
	vec4 binary 	= vec4(br+bc);
	
	
	float pc	= counter( c_p,  np, p + vec2( -31.5, 0.));
	float pr	= bit_row( np,   3., p + vec2(-35., -6.5));
	vec4 prime 	= vec4(pr+pc);
	//prime.x		= abs(pr-bit_row(   n, 3., p + vec2(-35., -6.5)));
		
	
	vec4 result	= max(binary, prime);				    //binary on left mod on right
	//result 		-= uv.y > .2 ? float(fract(time*frequency*256.)-.1 < .1) : 0.;
	
	vec4 buffer 	= texture2D(backbuffer, uv - vec2(0., 1./resolution.y));
	result		= uv.y < .21 ? result : mix(result, buffer, vec4(.999));  //quick and simple way to plot it
	
	result		= uv.y < .2 ? result.yyyy : result;
	result		*= mouse.x+mouse.y < .04 ? 0. : 1.;
	
	gl_FragColor 	= result;

}//sphinx - thank you for this code (unknown origional author)

float counter(float s, float n, vec2 p)
{
	float c = 0.;
	vec2 cpos = vec2(4,1);	
	c += sprite(s, 3., 5., floor(p-cpos));
	cpos.x += 4.;
	c += sprite(c_colon, 3., 5., floor(p-cpos));
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


float fpmod(float n)
{
	n = floor(32.-n*256.);
	return floor(mod(n*3.+n*5.+n*17.+n*257.+n*65537., 256.));
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
