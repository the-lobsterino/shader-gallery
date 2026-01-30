// Actual RNG On GLSL
// By Sam Belliveau

#ifdef GL_ES
precision highp float;
#endif

// PLEASE: GO TO THE MAIN FUNCTION AND UNCOMMENT

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// functions for all of the RNG
float norm(float);
float mix_floats(float,float,float);
float rand(vec2);

void main( void ) {

	vec2 pos = gl_FragCoord.xy;
	
	float r = rand(gl_FragCoord.xy * 0.523);
	float g = rand(gl_FragCoord.xy * 0.456);
	float b = rand(gl_FragCoord.xy * 0.789);
	
	gl_FragColor = vec4(r, g, b, 1.0);
	
	// GLSL will not let me save without this line right here
	// please uncomment to see the rng
	gl_FragColor = vec4(pos.x / resolution.x, pos.y / resolution.y, 0, 1.0);
	
}





/* This function normalizes a number between */
/* 0 - 1 while keeping all of the entropy in the float */
float norm(float x) {
	x = abs(x) + (1.0 / 256.0);
	return fract(x * pow(0.5, floor(log2(x))));
}

/* Mix three floating point numbers together */
float mix_floats(float a, float b, float c) {
	// Combine A and B in two different ways
	a = norm(a);
	b = norm(b);
	c = norm(c);
	float mul = norm(a * b * c);
	float add = norm(a + b + c);
	
	// Combine two outputs
	return norm(mul + add);   
}

/* Calculate random number based on seed */
#define RNG_ITER 4
float rand(vec2 seed) {
	// Makes an entropy pool of 3 variables
	float a = norm(seed.x);
	float b = norm(seed.y);
	float c = norm(time);
	
	// Very effectively mixes up the pool
	for(int i = 0; i < RNG_ITER; ++i) {
		a = mix_floats(a, b, c);
		b = mix_floats(b, c, a);
		c = mix_floats(c, a, b);
	}
	
	// Return result
	return mix_floats(a, b, c);
}
