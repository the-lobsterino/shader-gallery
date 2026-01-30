// more stolen stuff by a sussy guy
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 q = 15.*( 2.*gl_FragCoord.xy - resolution.xy )/resolution.y  ;
 
	float d = length(q+vec2(sin(time)*15.0,cos(time)*15.0));
	
	float r = 1.0;
	 
	
	r   =  01.4 + 01.4*cos( -8.0*time+atan(q.y,q.x)*20.0 + 0.5 -d )*d;
	r  *=  01.4 + 01.4*sin( 4.0*time+atan(q.x,q.x)*20.0 + 0.5 +d )*d;

		
	float f =   r ;
	
	
	gl_FragColor = vec4( vec3( f*0.2, f, f)  , 1.0 );

}