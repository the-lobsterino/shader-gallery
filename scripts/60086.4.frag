// amiga demo style 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	 
	vec2 p = gl_FragCoord.xy/resolution;
	
	 
	
	
		
	
	float rr = step(0.00,fract(10.*p.x)-0.2*sin(time))-step(0.33,fract(10.*p.x)-0.2*sin(time));
	float gg = step(0.33,fract(10.*p.x)-0.2*sin(time))-step(0.66,fract(10.*p.x)-0.2*sin(time));
	float bb = step(0.66,fract(10.*p.x)-0.2*sin(time))-step(1.00,fract(10.*p.x)-0.2*sin(time));
    
    float a =   fract(20.*p.y+time*0.5)*rr;
    float b =   fract(20.*p.y-time*1.0)*gg;
    float c =   fract(20.*p.y+time*1.5)*bb;
    	
		
	
    
	 gl_FragColor = vec4((sqrt(p.y*c))  ,
			     (sqrt(p.y*b))  ,
			     (sqrt(p.y*a))  ,1.0) ;
	    
	 
		
}