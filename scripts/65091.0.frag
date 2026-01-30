#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
   
//binary and gray codes - sunday night special

void main( void ) 
{
	//formatting
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 scale	= vec2(255., 16.);
		
	
	//generator functions 
	//(for turning the space into bits)
	//if you mouse to the right you can see what they output precisely

	//floored components 
	vec2 position	= fract(uv * vec2(1., 2.) + vec2(0., .75)) * scale;
	position	= ceil(position);
	
	float bit 	= position.x;
	float exponent 	= pow(2., position.y);
	float rotation 	= pow(2., position.y+1.);	
	
	
	//binary encoding
	//you've heard of this, have you?
	//https://en.wikipedia.org/wiki/Binary_code
	float binary 	= mod(bit, exponent) / exponent * 2.;

	
	//gray encoding
	//used in error correction due to only one bit changing as you move up and down in integers
	//(also makes a nice tree generating function for your fractal landscape needs)
	//https://en.wikipedia.org/wiki/Gray_code
	float gray 	= mod(bit + exponent / 2., rotation)/exponent;

	

	//extra stuff
	//pulling out some info from the generator functions for display - 1 in green and 0 in red, as well as the black and white version
	float b_zero    = float(binary == 0.) * .5;
	float b_one     = float(binary == 1.) * .5;
	float b_floor	= floor(binary);

	
	float g_zero    = float(gray == 0.) * .5;
	float g_one     = float(gray == 1.) * .5;
	float g_floor	= floor(gray);
	
	
	
	
	//composite and display results
	bool top_panel  = uv.y > .5;
	vec4 result	= vec4(0.);
	result		+= top_panel ? b_floor : g_floor;
	
	if(mouse.x > .5)
	{
		result		*= top_panel ? 2.-binary : 2.-gray;
		result.xz	-= top_panel ?     b_one :  g_one;
		result.x	+= top_panel ?    b_zero : g_zero;
	}
	
	gl_FragColor = result;
}//sphinx