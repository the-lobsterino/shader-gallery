#ifdef GL_ES
precision mediump float;
#endif

//emergent frequency space harmonics in closed high entropy system
//mouse bottom left to reset 
//wait for cool stuff to happen - about 1 in 4 chance 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

varying vec2 surfacePosition;

float hash(float x) 
{ 
	x*=1234.56789; 
	return fract(x/(1.+fract(x))); 
}

float hash(vec2 uv)
{ 
	return hash(uv.x + hash(uv.y/-hash(uv.y+hash(uv.x)))); 
}
vec2 wrap_and_offset_uv(vec2 uv, vec2 offset)
{
	uv = mod((gl_FragCoord.xy+offset)/resolution, 1.);
	return uv;
}

vec4 texture(vec2 uv)
{
	uv.y = abs(uv.y-.5)*4.;
	uv.x = uv.x*.0001;
	
	float l = hash(16.+uv.x);
	float r = hash(17.+uv.x);
	
	return vec4(l, r, 0., 0.) * float(float(l > uv.y) + float(r > uv.y));
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

void main( void ) {

	vec2 uv		= gl_FragCoord.xy/resolution.xy;

	vec4 buffer	= texture2D(renderbuffer, uv);
	
	float t		= time;
	float h 	= hash(uv);
	
	float p		= floor(1. + uv.y * 8.);
	
	
	vec2 offset	= vec2( p ) * rmat(t + h * 6.28);
	uv 		= wrap_and_offset_uv( uv, offset );
	
	vec4 neighbor 	= texture2D(renderbuffer, uv);	
	
	float bound 	= length(buffer + neighbor*3.8*sin(time*2.)*sin(time*2.));
	
	vec4 result 	=  bound > 0. && bound < 1. ?  abs(cos((buffer)-sin(neighbor))) : mix(buffer, neighbor, .5);
	
	result 		= time < .5 || mouse.x + mouse.y < .02 ? texture(vec2(hash(uv.x-hash(uv.y))+hash(uv.y-hash(uv.x)))) : result;	
	
	if(length(surfacePosition-mouse) < 0.01){
		result += vec4(0.7);
	}	
	gl_FragColor = result;
}//sphinx