#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//synthetic aperture, aka beamforming

//added per emitter wavelength variation (neat twisty beam)
//improved amplitude calculation

//cribbed from this : https://www.shadertoy.com/view/ldlSzX

uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform vec2 resolution;

#define EMITTERS 32
#define SCALE			41.
#define WAVELENGTH		8.
#define VELOCITY		8.
#define CONFIGURATION		floor(mod(time/8., 2.))
#define AMPLITUDE		.05
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
	
	float energy		= 0.;
	for(int i = 0; i < EMITTERS; i++)
	{
		float interval	= float(EMITTERS-i)/float(EMITTERS);
		
		vec2 source 	= vec2(0.);
		float ph = .05*time+float(i)*3.141592*2./float(EMITTERS);
		source += 8.0*vec2(cos(ph), sin(ph))*(0.25+0.05*length(mouse-.5));
		//source 		= CONFIGURATION == 0. ? vec2((interval*radius-radius/2.)*2., -scale*.75) 	: source;		
		//source 		= CONFIGURATION == 1. ? vec2(radius, 0.) * rmat(TAU * interval) 		: source;
		
		float theta  	= distance(source, position);	
		float range 	= distance(source, target);
		
	        float shift  	= theta - velocity * time;
		float phase 	= wave((1.-abs(interval-.5)) * wavelength * (shift - range));
		float amplitude 	= pow(theta, inversesqrt(range*AMPLITUDE));
		
		energy 		+= phase/amplitude;
	}

	
	vec4 result	= vec4(0.);

	result.x		= energy;
	result.z		= 1.-energy;
	result 		*= abs(energy);
	
	result.w		= 1.;
	
	gl_FragColor	= (pow(texture2D(backbuffer, fract((gl_FragCoord.xy+vec2(0,1))/resolution)).rrba, vec4(1.+length(mouse-.5)))+result)/1.05;
}//sphinx