

precision highp float;

//numero di pixel in x ed y.
uniform vec2 resolution; //passato come uniform da programma host


#define SCALING 10.0
#define COLOR vec4(0.267,0.7255,0.0,1.0)
#define LINE_WIDTH 1.0
#define GAMMA 0.4

float function(vec2 p){

	float x = p.x; 
	float y = p.y;
	
	return (  sin(x) - y );  // y = sin(x)
	
	//return (x*x + y*y - 10.0); // cerchio di raggio 10
	
	//return (  2.0*(x*x) + 3.0*(x) + -5.0 - y  );
	
	
}


vec4 compute(vec2 p){


	float value = function(p);
	
	float color = (LINE_WIDTH-abs(value));
	
	vec4 outcolor = color * COLOR;
	
	outcolor = pow(outcolor, vec4(1.0/GAMMA));
		
	return outcolor;
	
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ); //normalizza da 0 ad 
	
	p *= 2.0; p -= 1.0; //normalizzo da -1 a 1.
	p *= SCALING;
	
	
	vec4 outvalue = compute(p);
		
	
	gl_FragColor = outvalue;
	


}