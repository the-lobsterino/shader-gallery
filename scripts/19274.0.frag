#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

//some notes on psudo random number generators

//these functions have strengths and weaknesses 
//entropy	- how random is it?
//period	- how long until it repeats?
//domain	- what is the range of input that works? - numbers going out of range will eventually give you patterns of all 0. or infinity - escape time, so to speak
//computation	- how many operations does it take?
//precision	- how does it hold up across precision (mediump, highp) - are you relying on floating point errors
//hardware	- does it give the same result on all hardware?  (sin, cos, etc) will be different gpu to gpu - fract and mod are generally safe


float hash(float x); //simple fract prng - countless authors




void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;

	float h 	= hash(uv.x + time + hash(uv.y + time));
	
	gl_FragColor 	= vec4(h);
	
}//sphinx - share thoughts / corrections / functions so everyone can figure out better ones




//simple fract prng - countless authors
float hash(float x)
{
	const float e = 1234.56789;
	x 	*= e;		//x is now very "big"
	float y = fract(x);	//chop off the end decimals - due to the big multiplier decimals will very wildly as x increased slowly - y is now [0.-0.999999999]
	x 	= x/(1.+y);	//divide big x by the decimals  - bonus error / entropy  - (add 1. to avoid div by 0 which show up as lines)
	x 	= fract(x);	//chop off the mantissa again for a normalized random looking result 
	return x;
	
	//1234.56789 is not just any number - results will vary strongly - obv 2 is a bad choice for randomness - but what exactly is good? not certain.
	
	//"high bitwise entropy?" - what looks like randomness in binary appears to us again visually in the results 
	//http://www.binaryconvert.com/result_float.html?decimal=049050051052046053054055056057 - this is how those bits look, try other numbers
}

//float hash(float x) { x*=1234.56789; return fract(x/(1.+fract(x))); }