#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//synthetic aperture, aka beamforming

//cribbed from this : https://www.shadertoy.com/view/ldlSzX

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EMITTERS 32
#define SCALE			32.
#define WAVELENGTH		4.
#define VELOCITY		.25
#define CONFIGURATION		1.
#define AMPLITUDE		.5
#define RADIUS			32.
#define TAU (8.*atan(1.))


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	
	return mat2(c, s, -s ,c);
}

float wave(float x)
{
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}

void main( void ) 
{
	float scale		= SCALE;
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 uv			= gl_FragCoord.xy/resolution;
	vec2 position		= (uv * 2. - 1.) * aspect * scale;
	vec2 mouse		= (mouse * 2. - 1.) * aspect * scale;

	
	vec2 target		= mouse;
	
	float wavelength 	= WAVELENGTH;
	float velocity		= VELOCITY;
	float radius		= RADIUS;
	position			/= dot(position, position);
	position *= 322.01;
	float energy		= 0.;
	for(int i = 0; i < EMITTERS; i++)
	{
		float interval	= float(EMITTERS-i)/float(EMITTERS);
		
		vec2 source 	= vec2(0.);
		source 		= CONFIGURATION == 0. ? vec2((interval*radius/4.-radius/8.)*2., -scale*.75) 	: source;		
		source 		= CONFIGURATION == 1. ? vec2(radius, 0.) * rmat(TAU * interval) 		: source;
		
		float theta  	= distance(source, position);	
		float range 	= distance(source, target);
		
	        float shift  	= theta - velocity * time;
		float phase 	= wave(1. * wavelength * (shift - range));
//		float amplitude 	= pow(theta, sqrt(abs(theta-range)))*AMPLITUDE;
		float amplitude 	= theta*AMPLITUDE;
		energy 		+= phase/amplitude;
	}

	
	vec4 result	= vec4(0.);

	result.x		= energy;
	result.z		= 1.-energy;
	result 		*= abs(energy);
	
	result.w		= 1.;
	
	gl_FragColor	= result;
}//sphinx