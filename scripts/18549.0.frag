#ifdef GL_ES 
precision highp float;
#endif

//constructable polygons
//sphinx

uniform float     time;  
uniform vec2      mouse;
uniform vec2      mousetravel;
uniform vec2      resolution;
uniform sampler2D backbuffer;


#define PI  3.1415926
#define TAU 6.2831853
#define RPI .31830988
#define HPI 1.5707963
#define E   2.7182818

//wtfract - trig - approximations - need a log approx now... maximum inefficiency!

float ftan(float x)
{
	x = x * RPI;
	float f0 = fract( -x - .5 );
	float f1 = fract(  x + .5 );
	x = log(f1*.5) - log(f0*.5);
	return x;
}

float fatan(float x)
{
	x = clamp(x, -4., 4.);
	return (x)/log( PI + x * x - .5);
}

float fatan(float y, float x)
{

	float c0 = PI/4.;
	float c1 = c0+PI;
	float a = abs(y);
	float theta = 0.;
	if (x >= 0.)
	{
		float r = (x-a)/(x+a);
		theta = c0 - c0 * r;
	}
	else
	{
		float r = (a-x)/(a-y);
		theta = c1 + c1 * r;
	}
	
	theta = y > 0. ? theta : -theta;
	
	return theta;
}

void main() 
{
	vec2 uv = gl_FragCoord.xy/resolution;
	
	vec2 p	= uv * 2. - 1.;
	p.x	*= resolution.x/resolution.y;
	
	vec3 f 	= vec3(0.);
	f.x	= ftan(p.x*8.)+p.y;
	f.y	= fatan(p.x)+p.y;
	f.z	= fatan(p.x,p.y);
	f	= step(f, vec3(0.));
	
	vec3 t	= vec3(0.);
	t.x	= tan(p.x*8.)+p.y;
	t.y	= atan(p.x)+p.y;
	t.z	= atan(p.x,p.y);
	t	= step(t, vec3(0.));
	
	gl_FragColor = (mouse.x > .5 ? vec4(t, 1.) : vec4(f, 1.));
}