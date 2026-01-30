#ifdef GL_ES
precision highp float;
#endif

//incredibly inefficient way to draw lines

uniform vec2      mouse;
uniform vec2      resolution;
uniform float	  time;

vec2 	format(vec2 uv);

void main(void)
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	uv 		= uv - .5;
	
	const int iterations = 256;
	
	float affine	= float(iterations)*.5;

	float word	= 128.;
	
	vec2 field	= uv;

	bool axis 	= abs(mouse.x -.5) > abs(mouse.y - .5);	
	
	float parity_x 	= mouse.x > .5 ? 1. : -1.;	
	float parity_y	= mouse.y < .5 ? axis ? 1. : -1. : 1.;	
	
	field.x		*= parity_x;	
	field 		= axis ? field.xy : field.yx * parity_y;	

	float theta	= axis ? 1.-abs(mouse.y-.5)*2. : 1.-abs(mouse.x-.5)*2.;

	
	vec2 shift_y	= mouse.y > .5 ? vec2(1., 1.) : vec2(1., -1.);
	vec2 shift_x 	= mouse.y > .5 ? vec2(1., 0.) : vec2(1., 0.);;
	
	
	shift_x		/= resolution;
	shift_y		/= resolution;
	
	
	vec2 position	= vec2(0.);
	float result	= 0.;
	for (int i = 0; i < iterations; i++)
	{
		bool cut	= theta + fract(position.x * word) < 1.;
		
		position 	+= cut ? shift_y : shift_x;
		
		result		+= float(floor(position * affine)==floor(field * affine));
	}
	
	gl_FragColor 	=  vec4(result) + field.x;
}//sphinx

vec2 format(vec2 uv)
{
	uv       = uv - .5;
	uv.x     *= resolution.x / resolution.y;
	return uv;
}


