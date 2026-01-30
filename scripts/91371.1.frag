#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D renderbuffer;

#define PHI 		((sqrt(5.)+1.)*.5)
#define TAU 		(8.*atan(1.))


vec3 hsv(in float h, in float s, in float v)
{
    	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float contour(float x)
{
	return clamp(.000002/(x*x), 0., 1.);
}



float line(vec2 p, vec2 a, vec2 b)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);
	return contour(distance(p, mix(a, b, u)));
}


float ring(vec2 p, float r)
{
	return contour(abs(length(p)-r));
}


float circle(vec2 p, float r)
{

	return contour(max(length(p)-r, 0.));
}




vec2 equidistribute(float i)
{
	//http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/
	const float r 	= 1.32471795724474602596;
	const vec2 r2 	= 1./vec2(r, r * r); 			
	return fract(i*r2+.5);
}


void main( void ) 
{
	vec2 aspect		= resolution.xy/min(resolution.x, resolution.y);
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	vec2 p			= (uv-.5)*aspect;


	vec4 color		= vec4(0., 0., 0., 1.);
	
	color 			+= ring(p, .5);
	
	const float iter 	= 512.;
	const float rcp		= 1./iter;
	float r 		= .0025;
	vec2 s 			= vec2(0., 0.);
	vec2 sp			= s;
	
	vec3 t 			= vec3(0., 0., 0.);
	for(float i = 1.; i < iter; i++)
	{
		if(i < ((cos(time)+1.) * .5)*iter)
		{		
			s 		= equidistribute(iter+i);
			color.xyz	+= circle(p-s+.5, r);
			color.xyz	+= ring(p-s+.5, .040) * hsv(i * rcp, 1., .25);
			color.xyz	+= line(p+.5, s, equidistribute(i)) * hsv(i * rcp, 1., .125);
		}
	}
	

	gl_FragColor		= color;
}//sphinx