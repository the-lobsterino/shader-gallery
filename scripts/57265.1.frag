//this is a plot of square roots mod 1

//x axis is the square root of x mod 1 (only the values after the decial point)
//y axis is 0-1 range


//the stair step pattern is a useful tool
//here's an example used it in a function that makes a bijective map of the ulam spiral 
//http://glslsandbox.com/e#57264.0





#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 mouse;
uniform vec2 resolution;


////definitions
#define ROOT 	2.
#define RANGE 	64.

//#define ADJUST_RANGE_WITH_MOUSE 	//comment this in to adjust the range with the mouse
//#define SHOW_COLLISIONS 		//comment this in to show when different roots have the same value (most often due to limits of how floating point works - is that always true?)
////


//root of x mod 1
float residual_root(float x, float root)
{
	return fract(pow(x, 1./root));	
}


void main( void ) 
{

	float range 						= RANGE;
	#ifdef ADJUST_RANGE_WITH_MOUSE
		range 						*= mouse.x; 
	#endif	
	vec2 uv 						= floor(gl_FragCoord.xy)/resolution.xy;

	float x							= floor(uv.x * range);
	float y							= uv.y;
	
	
	
	
	//initialize variables
	float vertical_plot_of_root_residuals			= 0.;
	float horizontal_plot_of_root_residuals 		= 0.;	
	float horizontal_plot_of_collisions			= 0.;


	
	
	//vertical plot (with some additional grid lines for clarity)
	vertical_plot_of_root_residuals				= step(y, residual_root(x, ROOT));	
	float grid_lines					= floor(fract(uv.x * range)*resolution.x-.5) > RANGE*2. ? 1. : 0.;	
	vertical_plot_of_root_residuals				*= grid_lines;
	
	
	
	
	//horizontal plot (and optional collisions)
	for(float i = 0.; i < RANGE; i++)
	{
		if(i <= x)
		{
			float root_residual			= step(abs(residual_root(i, ROOT)-y-2./resolution.y), 1./resolution.y)*.5;	
			horizontal_plot_of_root_residuals	+= root_residual;
			horizontal_plot_of_collisions		= horizontal_plot_of_root_residuals > 1.? 1. : 0.;
		}
	}
	
	
	
	
	//combine results 
	vec4 result						= vec4(0.,0.,0.,1.);
	result.xyz						+= vertical_plot_of_root_residuals * .25;
	result.y						+= horizontal_plot_of_root_residuals * .75;
	
	#ifdef SHOW_COLLISIONS
		result.xyz					*= intersection > 0. ? 0. : 1.;
		result.x					+= intersection;
	#endif 

	
	//output as color (x = red, y = green, z = blue)
	gl_FragColor						= result;
}//sphinx