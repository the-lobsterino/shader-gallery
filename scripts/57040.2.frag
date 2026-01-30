#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define BITWISE_ENTROPY_X float(0x00001515)	
#define BITWISE_ENTROPY_Y float(0x00000AEA)
#define BITWISE_ENTROPY_Z BITWISE_ENTROPY_Y/BITWISE_ENTROPY_X //let this run in the preprocessor 

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

vec2 normalize_hash_input(vec2 uv)
{	
	 return	dot(uv, uv.yx) > 1. 
		? normalize(uv + vec2(BITWISE_ENTROPY_Y, BITWISE_ENTROPY_Z))
		: uv;
}


float hash(float x)
{
	x = fract(x) * BITWISE_ENTROPY_X;	
	return fract(fract(x) * x);
}


float hash(vec2 uv)
{		

	return hash(hash(uv.y) + uv.x);
}


void main( void ) {

	vec2 m			= mouse;	
	m			= m * 2. - 1.;
	
	vec2 uv 		= gl_FragCoord.xy/resolution;
	uv 			*= m.x;

	
	vec4 prior		= texture2D(renderbuffer, fract(uv));
	float i 		= hash(fract(uv+normalize(prior.yz-.5)));
	
	vec2 edge		= vec2(hash(uv.x+i), hash(uv.y+i));

	vec2 d			= fract(vec2(-dFdx(edge.y), dFdy(edge.x)));
	
	gl_FragColor		= mix(vec4(i), texture2D(renderbuffer,fract(i * edge*d)), m.y);
	gl_FragColor.z		*= .5*(i-prior.x)*8.;
	gl_FragColor.xy		= edge;
	gl_FragColor.w 		= floor(gl_FragColor.z);
}//sphinx
