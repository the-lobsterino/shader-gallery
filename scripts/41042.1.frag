#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//rainbows

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;


vec2 inverse_ulam(float n)
{
	float r	= sqrt(n+.5);
	float s = 3. - fract(r) * 4.;	
	r	*= mod(r, 2.) > 1. ? .5 : -.5;
	
	return ceil(s > 1. ? vec2(r, 2. * r - r * s) : vec2(r * s, r));
}


vec2 rainbow_hash(float i)
{	
	vec2 uv	=  inverse_ulam(i);
			
	return uv;
}


float contour(float field, float scale)
{
	return 1. - clamp(field * min(resolution.x, resolution.y)/scale, 0., 1.);
}


float line(vec2 position, vec2 a, vec2 b, float scale)
{
	b = 	   b - a;
	a = position - a;
	return contour(distance(a, b * clamp(dot(a, b) / dot(b, b), 0., 1.)), scale);
}


float circle(vec2 position, float radius, float scale)
{
	return contour(abs(length(position)-radius), scale);
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c,s,-s,c);
}



vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


void main( void ) 
{
	float scale		= 1.5;
	vec2 uv 		= gl_FragCoord.xy/resolution;
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 position		= (uv-.5) * aspect * scale;
	
	float modulus		= 1024.;
	
	float radius		= 322./max(resolution.x, resolution.y);
	vec4 result		= vec4(0.);
	const float iter	= 256.;
	

	float m			= 0.;
	vec2 prior_p		= vec2(0.);
	
	vec4 lines		= vec4(0.);
	vec4 dots		= vec4(0.);
	
	float t			= mod(floor(12.5* time)*iter*221156., exp2(modulus));
	for(float i = 0.; i < iter; i++)
	{
		float n = mod(i*t, exp2(modulus));
		vec2 p 	= inverse_ulam(n);	
		p	= mod((p-modulus*.5), modulus)/modulus-.5;
				
		if(i > 1.)
		{
			float k 	= mod(t + i, iter)/iter;
			vec4 hue 	= vec4(hsv(k, 1., .125), 1.);
			dots		+= circle(position-p, radius, scale) * hue;		
	
			lines 		+= line(position, prior_p, p, scale) * hue;
		}
		
		prior_p 	= p;
	}
	
	vec4 buffer	= texture2D(renderbuffer,uv);	
//	if(mouse.x < .5)
	{
		result		= mix(max(dots, buffer), buffer, .5)-.0005;
	}
//	else
	{
		//result		+= lines;
//		result.w	= 0.;
	}
	
	result		*= float(mouse.x + mouse.y > .02);
	gl_FragColor 	= result;
}//sphinx - bleh, twitter - alleycatsphinx