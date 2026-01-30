precision mediump float;

#extension GL_OES_standard_derivatives : enable

//ulam spiral inverse (in progress - feel free to have a shot - maybe use those standard derivatives?)

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;

vec2 inverse_ulam(float spiral, vec2 resolution)
{
	return vec2(fract(spiral/16.), fract(spiral/8.)); //maybe the right way to start figuring it out?	
}

float ulam_spiral(vec2 p)
{
	float x 		= abs(p.x);
	float y		= abs(p.y);
	bool q		= x > y;
	
	x		= q ? x : y;
	y		= q ? p.x + p.y : p.x - p.y;
	y 		= abs(y) + 4. * x * x + 1.;
	x 		*= 2.;
	
	return q ? (p.x > 0. ? y - x - x : y) 
		 : (p.y > 0. ? y - x : y + x);	
}

void main( void ) 
{
	vec2 field		= gl_FragCoord.xy;
	
	float spiral		= ulam_spiral(field);
	
	vec2 inverse		= inverse_ulam(spiral, resolution);

	vec4 result		= vec4(inverse, 0., 1.);	
	
	gl_FragColor		= result;
}//sphinx