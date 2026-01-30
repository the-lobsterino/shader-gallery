#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//curious
//(this is all of course to get the little dots to move better)


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float ulam_spiral(vec2 field);


void main( void ) 
{
	vec2 coordinate		= gl_FragCoord.xy- .5 * resolution;
	
	vec2 field		= coordinate;
	
	float spiral		= ulam_spiral(field);
	
	float m			= floor(mouse.x * 32.);
	float diagonal		= mod(spiral, sqrt(spiral/(m*m)));
	
	float x 			= abs(coordinate.x);
	float y			= abs(coordinate.y);
	bool q			= x > y;
	x			= q ? x : y;	
	
	float psudo_normed 	= diagonal/x*m*.5;

	vec4 result		= vec4(0.);	
	result 			+= psudo_normed;
	
	gl_FragColor		= result;
}//sphinx


float ulam_spiral(vec2 p)
{
	float x 		= abs(p.x);
	float y		= abs(p.y);
	bool q		= x > y;
	
	x		= q ? x : y;
	y		= q ? p.x + p.y : p.x - p.y;
	y 		= abs(y) + 4. * x * x + 1.;
	x 		*= 2.;
	
	return q ? (p.x > 0. ? y - x - x 
		             : y) 
		 : (p.y > 0. ? y - x 
		             : y + x);	
}
