#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float scale	= 16.;
	
	vec2 fc 	= gl_FragCoord.xy - vec2(resolution.x * .5, 0.);
	fc.x 		*= resolution.y/resolution.x;
	fc 		*= 1./scale;
	
	float y 	= fc.y;
	
	//what to call these things?
	float power 	= floor(y);	
	float exponent 	= pow(2., power);
	float shift	= floor(32.*(mouse.x-.5)*power)/2.;
	
	float mantissa	= fc.x;
	mantissa 	+= shift;
	
	float affine 	= fract(mantissa/exponent*2.);	
	float bit 	= floor(mod(mantissa, exponent)/exponent*2.);
	
	
	
	//pretty much all you need
	float theta 	= abs(affine-bit);
		
	//just a smoothed out version of theta so it looks like a physical wave - sigmoidal!
	float sigma 	= theta/2.;
	sigma 		*= 1.-sigma;
	sigma 		*= sigma;
	sigma 		*= 16.;

	
	//nice line plots of the gradients
	float plot 	= 1. - fc.y + power;
	float delta	= smoothstep(.0, abs(1.-affine-plot), .5/scale);
	float wave	= smoothstep(.0, abs(sigma-plot), .5/scale);
	float tree	= smoothstep(.0, abs(theta-plot), .5/scale); //someone show me how to do the right recursive branching here
	

	
	//some might not consider this beautiful code...
	vec4 result = vec4(bit);
	float m = floor(mouse.y * 3.);
	float mask = 0.;
	mask = m == 2. ? delta : mask;
	mask = m == 1. ? tree  : mask;
	mask = m == 0. ? wave  : mask;
	result = abs(result-mask);
	result *= vec4(m==0., m==1., m==2.,1.);
	result = max(result, bit-mask);
	gl_FragColor 	= result;
}//sphinx