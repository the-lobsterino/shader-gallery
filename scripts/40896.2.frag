#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// rainbows

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
	float scale		= 1.;
	vec2 uv 		= gl_FragCoord.xy/resolution;
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 position		= (uv-.5) * aspect * scale;
	
	

	

	//hash stuff
	float modulus		= pow(2., 5.)+1.;
	const float iterations  = 256.;		
	float velocity		= pow(2., 8.) * fract( time * (1.+mouse.x) );	
	float frame	 	= floor(.125 * time * velocity);		

	frame			= mod(frame, exp2(modulus));
	
	//drawing stuff
	vec4 lines		= vec4(0.);
	vec2 prior_p		= vec2(0.); 					
	vec4 dots		= vec4(0.);
	float radius		= 1./max(resolution.x, resolution.y);
	

	for(float i = -2.; i < iterations; i++)
	{
		float n = mod(i, exp2(modulus));
		
		vec2 p 	= rainbow_hash(n);
		p	/= iterations;
		p	= p*frame;         
		p	= mod(p-modulus*.5, modulus)/modulus-.5; //scale and center
				
		if(i > -1.)
		{
			float k 	= mod(frame + i, iterations)/iterations;
			vec4 hue 	= vec4(hsv(k, 1., 1.), 1.);
			
			dots		+= circle(position-p, radius, scale) * hue;		
		//	lines 		+= line(position, prior_p, p, scale) * hue; //drawing lines is slow, but demonstrate how the sample nicely hops from step to step
		}
		
		prior_p 	= p;
	}
	

	vec4 result	= vec4(0.);
	result		+= dots;
	result		+= lines;
	
	vec4 buffer	= texture2D(renderbuffer,uv);	
	float fade	= .00125;
//	result		= mix(dots*32.+buffer*.5, buffer, .975)-fade; 	//draw trails
	result		= mix(max(dots, buffer), buffer, mouse.y)-fade; //dont erase points
	
	
	result		*= float(mouse.x + mouse.y > .02);
	gl_FragColor 	= result;
}//sphinx - bleh, twitter - alleycatsphinx
