// Lea $40000,D0 AMIGA !!
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float fx (vec2 uv,float c ) {
	
	uv = 0.5*uv;
	
	float x = sin(uv.x+uv.y+time*-0.2)*tan(c+c)*abs(uv.y);
	float y = cos(uv.y*uv.x+time*0.05)*tan(c*c*c*c)*abs(uv.x);
	
	
	return  (abs(x+y) *3.0) ;
}	


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )  ;
            
	
	p = 1.5*p - mod(p, 0.009);// fake dither
	 
	
	float c =  fx(4.0*p,2.5+sin(time*0.005));
	      c += fx(2.0*p,1.5-sin(time*0.003));;;;;;;;;;;;;; 
	

	gl_FragColor = vec4(  cos(c),sin(c),sin(c), 1.0 );

}