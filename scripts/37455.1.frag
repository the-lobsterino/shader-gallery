#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


void main( void ) {
 
	 vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	      p.x *= (resolution.x / resolution.y) ;
	
	 vec2 q=p;
	
	 p.x =p.x+sin(time+p.y)*0.4;
	 p.y =p.y+sin(time+p.x)*0.4;
	
	
	float color = 0.0;
	
	float faktorx = 4.0;
	float faktory = 4.0;
	
	float bcarpan = 2.0;
	q.x =q.x+time*0.4;
	
	if( (mod( faktorx * q.x, 0.2 * bcarpan) < 0.1 * bcarpan) && ( mod( faktory * q.y, 0.2 * bcarpan) < 0.1 * bcarpan)) {
	   color = mod(faktorx, 1.0) * 0.4 + 0.4;
	}
	
	
	
	faktorx = 2.0;
	faktory = 2.0;
	
	
	if( (mod( faktorx * p.x, 0.2 * bcarpan) < 0.1 * bcarpan) && ( mod( faktory * p.y, 0.2 * bcarpan) < 0.1 * bcarpan)) {
	   color = mod(faktory*sin(time), 0.5) * 0.2 + 0.2;
		
	}
	

	gl_FragColor = vec4( color * abs(sin(time * 0.5)*p.x*3.), color* abs(cos(time * 0.5)*p.y*3.), color*sqrt(p.x*p.y), 1.0);

}