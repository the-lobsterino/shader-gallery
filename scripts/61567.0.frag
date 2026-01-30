#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

varying vec2 surfacePosition;
uniform float time;

// flash effect

// necip's next experiment with the superformula
// https://en.wikipedia.org/wiki/Superformula
// https://codepen.io/AzazelN28/pen/bZvqRb


	
float superformula(float phi, float a, float b, float m, float n1, float n2, float n3) {
  return pow( pow( abs( cos(m * phi / 4.0) / a ), n2 ) + pow( abs( sin(m * phi / 4.0) / b ), n3 ), -1.0 / n1 );
}


float renderFormula(float now, float t1, float t2, float t3, float i) {
  	float s1 = now / t1;
  	float s2 = now / t2;
  	float s3 = now / t3;
  
  	float a = abs(sin(s1));
  	float b = abs(sin(s1));
  
  	float m = abs(sin(s2) * 5.0);
  	float n1 = abs(sin(s3) * 5.0);
  	float n2 = abs(sin(s2) * 5.0);
  	float n3 = abs(sin(s1) * 5.0);
	float radius = superformula(i / 360.0 * 3.141592 * 2.0,a,b,m,n1,n2,n3);	
	return radius;
}

void main( void ) {

  
		
	vec2 p = surfacePosition;
	p -= 0.5;
	
	float c = renderFormula(.1, p.x, p.y, sin(time), cos(time));	
	gl_FragColor = vec4( vec3(c), 1.0 );

}