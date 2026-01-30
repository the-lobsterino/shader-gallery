// gtr
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 

void main( void ) {

	vec2 q = 50.*(02.*gl_FragCoord.xy - resolution.xy )/resolution.y  ;
 
	float d = 20.0/1.-length(0.5*q+vec2(sin(time),cos(time)));
	
	float r = 0.0;
	 
	float t = pow(time,2.0)/time; 
	
	r   =   cos(  t*time+atan(q.y,q.x)*02.0 + 0.5 +d )*d;
	r  *=   sin(  t*time+atan(q.x,q.x)*20.0 + 0.5 -d )*d;

		
	float f =   r ;
	
	
	gl_FragColor = vec4( vec3( f*0.2, f, f)  , 1.0 );

}