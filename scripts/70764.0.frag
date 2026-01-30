// Actual RNG On GLSL
// By Sam Belliveau
// question for Sam Belliveau see **??**

// Answer from Sam Belliveau

// **??** is this on shadertoy.com ?
// A: no, i just made this for fun because i like cryptography


#ifdef GL_ES
precision highp float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// Needed to continously get new results 
uniform float time;

/* This function normalizes a number between */
/* 0 - 1 while keeping all of the entropy in the float */
//**??** what is the origin of this norm function?
//A: I made this function just by thinking about what I needed
// If you know how a float works, you know it has a mantisa and exponent
// the mantisa is like an integer, so this function basically normalizes the float
// so that the exponent is the same, letting us keep all of the entropy in the mantissa
float norm(float x) {
	x = abs(x) + (1.0 / 256.0);
	return fract(x * pow(0.5, floor(log2(x))));
}

/* Mix two floating point numbers together */
float mix_floats(float a, float b) {
	// Combine A and B in two different ways
	a = norm(a);b = norm(b);
	float mul = norm(a * b);
	float add = norm(a + b);
	
	// Combine two outputs
	return norm(mul + add);   
}

/* Calculate random number based on seed */
float rand(float seed) {
	float rseed = 1.0-seed; //time // change back to time for noise display
	//return 1.0-seed; // return now to look at just the seed
	// Makes an entropy pool of 3 variables
	float a = mix_floats(seed, rseed);
	float b = norm(seed);
	float c = norm(rseed);
	
	// Very effectively mixes up the pool
	for(int i = 0; i < 8; ++i) {
		a = mix_floats(b, c);
		b = mix_floats(c, a);
		c = mix_floats(a, b);
	}
	
	// Return result
	return mix_floats(b, c);
}

void main( void ) {

	vec2 pos = surfacePosition;//<-zoom//gl_FragCoord.xy;
	
	float A = norm(pos.x);
	float B = norm(pos.y);
	float C = mix_floats(A, B);
	
	float r = rand(mix_floats(A, B));
	float g = rand(mix_floats(B, C));
	float b = rand(mix_floats(C, A));
	
	gl_FragColor = vec4(r, g, b, 1.0);
	
	// For some reason GLSL will not let me save
	// when this line is commented, so please uncomment
	// to see the results of the RNG
	gl_FragColor = vec4(A, B, C, 1.0);
	
}

