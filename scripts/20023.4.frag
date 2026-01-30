#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;


vec2 ComplexSin(vec2 z){
	// z = a + b*i
	
	// sin(b*i)
	// |>	= i*sinh(b)
	// via:	http://functions.wolfram.com/ElementaryFunctions/Sin/27/02/07/0002/
	// |>	= i*[exp(b) - exp(-b)]/2
	// via: https://en.wikipedia.org/wiki/Hyperbolic_function
	
	// cos(b*i)
	// |>	= cosh(b)
	// via: http://functions.wolfram.com/ElementaryFunctions/Cos/27/02/08/0002/
	// |>	= [exp(b) + exp(-b)]/2
	// via: https://en.wikipedia.org/wiki/Hyperbolic_function
	
	// sin(a + b*i)
	// |>	= sin(a)*cos(b*i) + cos(a)*sin(b*i)
	// via:	https://en.wikipedia.org/wiki/List_of_trigonometric_identities#Angle_sum_and_difference_identities
	// |>	= sin(a)*[exp(b) + exp(-b)]/2 + cos(a)*i*[exp(b) - exp(-b)]/2
	
	float expPlusB = exp(z.y);
	float expMnusB = exp(-z.y);
	float sinA = sin(z.x);
	float cosA = cos(z.x);
	return 0.5*vec2(sinA*(expPlusB+expMnusB), cosA*(expPlusB-expMnusB));
	
}


vec2 ComplexPow(vec2 z, float N){
	float r = length(z);
	float th = atan(z.x, z.y);
	float R = pow(r, N);
	float TH = th * N;
	
	return vec2(sin(TH), cos(TH))*R;
}

void main( void ) {
	
	
	vec2 z = surfacePosition;
	
	z = ComplexPow(z, 1./length(ComplexSin(z)+vec2(sin(time+z.x), cos(time+z.y))));
	
	float red = 1.+0.5*sin(z.x+time);
	float grn = 1.+0.5*sin(z.y-time);
	float blu = 1.+0.5*sin(length(z));
	
	gl_FragColor = vec4(red, grn, blu, 1.0 );
}