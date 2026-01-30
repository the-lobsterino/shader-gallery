#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

float fibbonacci(float n)
{
	float r5  = sqrt(5.);
	float ir5 = 1./r5;	
	return ir5 * pow((1.+r5)*.5, n) - ir5 * pow((1.-r5)*.5, n);
}

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	vec2 aspect	= resolution.xy/resolution.xx;
	float scale	= 64.;	
	vec2 position	= (uv - .5) * aspect * scale;

	
	float f		= fibbonacci(position.x);	
	float r		= f-fract(f);
	
	vec4 result	= vec4(0.);
	result		+= float(r > position.y) * .25;
	result.z	+= float(f > position.y) * .5;

	
	gl_FragColor 	= result;
}//sphinx


