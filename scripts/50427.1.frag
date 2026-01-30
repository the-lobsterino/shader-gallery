#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;


vec4 wave(float scale, float modulus) 
{
	vec2 aspect		= resolution/min(resolution.x, resolution.y);

	vec2 p	 		= floor(gl_FragCoord.xy/scale);
	vec2 mouse_p		= floor(mouse * resolution / scale);


	float lattice 		= abs(mod(p.x, modulus)) < 2. && abs(mod(p.y, modulus)) < 2. ? 1. : 0.;

	
	vec4 prior		= texture2D(buffer, p/resolution);
	vec4 state		= vec4(0., 0., 0., 0.);
	
	
	vec4 neighbor[8];
	vec4 sum;
	for(int i = 0; i < 3; i++)
	{
		vec2 offset 	= i == 0 ? vec2(  0.,  1.) :
				  i == 1 ? vec2(  1.,  0.) : 
			          i == 2 ? vec2(  0., -1.) : 
				           vec2( -1.,  0.) ;
		
		offset 		= floor(offset * modulus);
		
		vec2 sample_p	= (floor((p + offset)*scale)/resolution);
		
		neighbor[i]	= texture2D(buffer, sample_p);
		
		
		
		offset 		= floor(offset * 2. * modulus );
		
		sample_p	= (floor((p + offset)*scale)/resolution);
		
		neighbor[4+i]	= texture2D(buffer, sample_p);
				      
				      
		sum		+= neighbor[i] + neighbor[i+4];
	}

				      
	if(prior.y == 0. && sum.y == 1.)
	{
		if(neighbor[7].y == 1. && neighbor[2].y == 0. && neighbor[2].x == 0.)
		{
			state.y	+= 1.;
		}
		
		if(neighbor[6].y == 1. && neighbor[3].y == 0. && neighbor[3].x == 0.)
		{
			state.y	+= 1.;
		}
		
		if(neighbor[5].y == 1. && neighbor[0].y == 0. && neighbor[0].x == 0.)
		{
			state.y	+= 1.;
		}
		
		if(neighbor[4].y == 1. && neighbor[1].y == 0. && neighbor[1].x == 0.)
		{
			state.y	+= 1.;
		}
	}

				      
	if(sum.y > 0.)
	{
		state.x 		= 1.;
	}		      
	
				      
	if(prior.y == 1.)
	{
		state.y		= 0.;
	}
				      
				      			      
	if(sum.x > 1.)
	{
		state.y		= 0.;
	}
	
	if(prior.y == 0.  && prior.x == 0. && sum.y >= 2.)
	{
		state.y = 0.; 
		state.x = 0.; 	
	}			      				      
				     
		
				      
				      
	state.z		+= lattice * .5;	
	state.xyz	*= lattice;
	
	
	state.w 	= 1.;
      return state;
}

	
				      
void main( void ) 
{
	vec4 color 	= vec4(0.,0.,0.,0.);
	for(float i = 0.; i < 5.; i++)
	{
		color	+= wave(i/3., pow(3., i));
	}

	color.z		*= .5;
	color.y		+= length(gl_FragCoord.xy - mouse * resolution) < 16. ? 1. : 0.;	

	color		*= mouse.x + mouse.y > .02 ? 1. : 0.;
	
	gl_FragColor 	= color;
}


