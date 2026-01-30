#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cc (float c )
	
{
	  float r = floor( 2.0*(gl_FragCoord.x )*0.2) + time *0.08;
		  
   	  c =  0.95-(abs(sin(0.02*time-gl_FragCoord.y+r * 20.0)) * 0.5 ) * 2.;
	
	  return  c+c;
}
 


void main( void ) {

	 
	vec3 c  = vec3(cc(0.0),0.0,0.0);
	 
       gl_FragColor  = vec4( c.r*1.0,c.r*0.8,0.0,1.0);
	
	
	 
}