#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI (sqrt(5.)*.5+.5)
#define RPHI (sqrt(5.)*.5-.5)
#define TAU (8. * atan(1.))

mat2 rmat(float t)
{
	float c 	= cos(t);	
	float s 	= sin(t);
	return mat2(c, s, -s, c);
}

float circle(vec2 p, float r)
{
	return smoothstep(.0, abs(length(p)-r), .5/min(resolution.x, resolution.y));
}


float line(vec2 p, vec2 a, vec2 b)
{

	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	return smoothstep(.0,length(pa - ba * h),.25/min(resolution.x, resolution.y));
}

vec2 spiral(float i, float n)
{
	float theta 	= i * (1./n);
	float phi 	= i * (TAU / pow(PHI, -1.)) + floor(theta);
	return vec2(sin(phi), cos(phi)) * theta;	
}


bool prime(float p, int n)
{
	int x = int(p);
	for (int i = 2 ; i < 128; i++)
	{
		if(i < n)
		{
			if (i>=x) 
			{
				return true;
			}
			if (mod(float(x),float(i)) == 0.)
			{
				return false;
			}
		}
	}
	return true;
}


void main( void ) 
{
	vec2 uv 		= gl_FragCoord.xy / resolution.xy;
	vec2 aspect 		= resolution/min(resolution.x, resolution.y);
	vec2 p 			= (uv-.5) * aspect;

	vec4 color 		= vec4(0.,0.,0.,1.);
	
	float radius 		= .0015;
		
	const float iter	= 256.;		

	vec2 point		= vec2(0., 0.);
	vec2 prior		= vec2(0., 0.);
	float k 		= 0.;
	for(float i = iter; i > 0.; i--)
	{		
		point 		= spiral(i, iter)*.5;
	
		if(prime(i, int(iter)))
		{
			color.xyz 	+= line(p, point, prior) * .25;
			color.xyz 	+= circle(p - point, radius) * vec3(0., 1., 0.);
			prior 		= point;
		}
		else
		{
			color.xyz 	+= circle(p-point, radius) * vec3(1., 0., 0.);
		}
	}
	
	
	
	gl_FragColor 	= color;

}//sphinx