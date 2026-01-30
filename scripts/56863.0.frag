#define  delta = 0.1
#ifdef GL_ES
 
precision mediump float;
#endif

// 2.0 PLOTING ADVANCE Ploynomial functions:
//Illustration of shaping function for
// 1) Linear, Ploynomial, Exponential
// 2) Trignometric
// 3) SmoothStep
// 4) Mathematical

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float DELTA = 0.007;


// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct - DELTA, pct, st.y) -
          smoothstep( pct, pct + DELTA, st.y);
}

	
 /**
  Blinn-Wyvill Approximation to the Raised Inverted Cosine:  
   1) approximation for the cos() and sin() trigonometric functions for a small microprocessor (such as an Arduino)
   which has limited speed and math capabilities.
   2) have flat derivatives at 0 and 1, and the value 0.5 at x=0.5.
   3) 
**/
float blinnWyvillCosineApproximation (float x){
  float x2 = x*x;
  float x4 = x2*x2;
  float x6 = x4*x2;
  
   float fa = ( 4.0/9.0);
   float fb = (17.0/9.0);
   float fc = (22.0/9.0);
  
  float y = fa*x6 - fb*x4 + fc*x2;
  return y;
}

float doubleCubicSeat (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float y = 0.0;
  if (x <= a){
    y = b - b*pow(1.0-x/a, 3.0);
  } else {
    y = b + (1.0-b)*pow((x-a)/(1.0-a), 3.0);
  }
  return y;
}


float quadraticBezier (float x, float a, float b){
  // adapted from BEZMATH.PS (1993)
  // by Don Lancaster, SYNERGETICS Inc. 
  // http://www.tinaja.com/text/bezmath.html

  float epsilon = 0.00001;
  a = max(0.0, min(1.0, a)); 
  b = max(0.0, min(1.0, b)); 
  if (a == 0.5){
    a += epsilon;
  }
  
  // solve t from x (an inverse operation)
  float om2a = 1.0 - 2.0*a;
  float t = (sqrt(a*a + om2a*x) - a)/om2a;
  float y = (1.0-2.0*b)*(t*t) + (2.0*b)*t;
  return y;
}

/**--------------------------------------------------------------
float cubicBezier (float x, float a, float b, float c, float d){

  float y0a = 0.0; // initial y
  float x0a = 0.0; // initial x 
  float y1a = b;    // 1st influence y   
  float x1a = a;    // 1st influence x 
  float y2a = d;    // 2nd influence y
  float x2a = c;    // 2nd influence x
  float y3a = 1.00; // final y 
  float x3a = 1.00; // final x 

  float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;   
  float D =   x0a;

  float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
  float G = 3.0*y1a - 3.0*y0a;             
  float H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  int nRefinementIterations = 5;
  for (int i=0; i < nRefinementIterations; i++){
    float currentx = xFromT(currentt, A,B,C,D); 
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
    currentt = constrain(currentt, 0.0,1.0);
  } 

  float y = yFromT(currentt,  E,F,G,H);
  return y;
}

// Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}**/


void main() {
	
    	 // pixel coordinates	
   	 vec2 st = gl_FragCoord.xy/resolution;
	
	// Linear interpolation of y = x
	float y =  blinnWyvillCosineApproximation(st.x);
	
	//doubleCubicSeat
	 y =  doubleCubicSeat(st.x,10.0, 10.0);
	
	//quadraticBezier
	y =  quadraticBezier(st.x,0.0, 9.0);
	
	vec3 color = vec3(y);

  	 // Plot a line
   	   float pct = plot(st,y);
   	   color = (1.0-pct) * color + pct*vec3(1.0, 1.0, 0.0);

    gl_FragColor = vec4(color,1.0);
}
