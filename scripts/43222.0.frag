#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

//"Quazi-Random Sequence" (sometimes: "Low Discrepency Sequence")

//http://mathworld.wolfram.com/QuasirandomSequence.html
//https://www.johndcook.com/blog/2009/03/16/quasi-random-sequences-in-art-and-integration/
//https://en.wikipedia.org/wiki/Low-discrepancy_sequence

#define PHI 	((sqrt(5.) + 1.)/2.)
#define PI 	(4. * atan(1.))

void main( void ) 
{
	//Write in your own multipliers and md, use the floored mouse to see the pattern, then try using just mouse.x
	//Modular addition... It's very much like drawing steeper and steeper lines that wrap...
	

	float modulus		= 65536.;
	float multiplier 	= floor(time * 0.01875 * modulus); 

	float scale		= modulus/resolution.y;	
	float x			= gl_FragCoord.x;
	float y			= gl_FragCoord.y * scale;
	
	float sequence 		= mod(x * multiplier, modulus);
		
	
	//plotting stuff
	bool bar_plot		=          sequence > y;
	bool point_plot		= abs(sequence - y) < scale;
	vec4 color		= vec4(.125 , .185, .4, .125) * x/resolution.y;
	
	gl_FragColor 		= vec4(point_plot) + vec4(bar_plot) * color;
}//sphinx