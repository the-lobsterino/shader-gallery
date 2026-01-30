#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float color = 0.;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(.5,.5);
	//p.x*=resolution.x/resolution.y;				   
	
	float a = mouse.x; // Coefficient of x^2
	float b = mouse.y; // Coefficient of y^2
	float h = 1.;
	
	float equation = a*p.x*p.x+2.*h*p.x*p.y+b*p.y*p.y; // Equation for pair of straight lines	 
	
	color+=exp(-abs((equation))*1000.);
	
	gl_FragColor = vec4(color);
}