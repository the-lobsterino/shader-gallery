#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform vec2      resolution;
uniform float 	  time;

#define PHI			(sqrt(5.)*.5+.5)		
#define TAU			(8.*atan(1.))

float rabbit_sequence(float n, float phi)
{
	return fract((n-1.) * phi) < fract(n * phi) ? 1. : 0.;	
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

void main() 
{
	const float iterations		= 24.;
	vec2 p 				= gl_FragCoord.xy / 16.;



	mat2 rm;
	rm 				= rmat(mouse.y * TAU);
//	rm				= rmat(TAU/5.);
	rm				= rmat(time*-(.25/iterations));
	
	
	float r 			= 0.;	
	
	float phi 			= PHI-1.;
	float a				= .5/iterations;
	for(float i = 0.; i < iterations; i++)
	{			
		p			+= phi*i;
		p			*= rm;
		p 			*= 1.05;
		r			+= rabbit_sequence(p.x, phi) * a;
		r			+= rabbit_sequence(p.y, phi) * a;
	}

	
	vec4 color 			= vec4(0., 0., 0., 1.);

	
	color.xyz 			+= r;
	
	gl_FragColor 			= color;
}//sphinx

