// amiga demo style + 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	 
	vec2 p = 20.*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	p /= dot(p,p);
	
		
	
	float rr = step(0.00,fract(10.*p.x)-0.2*sin(time))-step(0.33,fract(10.*p.x)-0.2*sin(time));
	float gg = step(0.33,fract(10.*p.x)-0.2*sin(time))-step(0.66,fract(10.*p.x)-0.2*sin(time));
	float bb = step(0.66,fract(10.*p.x)-0.2*sin(time))-step(1.00,fract(10.*p.x)-0.2*sin(time));
    
    float a =   fract(2.*p.y+time*0.5)*rr;
    float b =   fract(2.*p.y-time*1.0)*gg;
    float c =   fract(2.*p.y+time*1.5)*bb;
    	
		
	
    
	 gl_FragColor = vec4(.5+a,.5-b,c,1.0) ;
	    
	 
		
}