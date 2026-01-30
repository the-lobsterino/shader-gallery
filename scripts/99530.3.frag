// options
#define modE 1

// stuff
#if ( modE == 1 )
precision highp float;
#elif ( modE == 2 )
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

//synthetic aperture, aka beamforming

//cribbed from this : https://www.shadertoy.com/view/ldlSzX

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time ( ( ( 0. + 24. )*20. )*mouse.y )*.0 // ändrom3da tweaked it
#define EMITTERS 		24
#define SCALE			32.
#define WAVELENGTH		1.
#define VELOCITY		2.
#define AMPLITUDE		.25
#define RADIUS			32.
#define TAU 			(8.*atan(1.)) // ok...


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
	vec2 uv			= gl_FragCoord.xy/resolution;// uv+=dot(0.2*uv,uv);
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
		
		vec2 source_0	= vec2((interval*radius/4.-radius/8.)*4., -scale*.75);
		vec2 source_1 	= vec2(radius, 0.) * rmat(TAU * interval + TAU * .25); 		

		vec2 source 	= mix(source_0, source_1, clamp(abs(cos(time * .25))*4.-2., 0., 1.));
		
		
		float theta  	= distance(source, position);	
		float range 	= distance(source, target);
		
	        float shift  	= theta - velocity * time;
		float phase 	= wave(1. * wavelength * (shift - range));
		
		float amplitude = theta*AMPLITUDE;
		energy 		+= phase/(1.+amplitude) + abs(phase) * .0225;

	}

	
	vec4 result	= vec4(0.);

	result.x		= energy;
	result.z		= 1.-energy;
	result 			*= abs(energy);

	result.w		= 1.;
	
	gl_FragColor	= result;
}//sphinx