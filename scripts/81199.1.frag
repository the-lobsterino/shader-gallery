// A sussy guy
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 q = 10.5*( 10.*gl_FragCoord.xy - resolution.xy )/resolution.y  ;
 
	float d = length(q+vec2(sin(time)*.0,cos(time)*.0));
	
	float r = 00.0;
	 
	
	r   =  1.4 + 5.4*cos( -10.0*time+atan(q.y,q.x)*2.0 + 2. -d )*d;
	r  *=  10.4 + 5.4*sin( 8.0*time+atan(q.x,q.x)*.0 + 2. +d )*d;

		
	float f =   r ;
	
	
	gl_FragColor = vec4( vec3( f*500.2, f, f)  , 1.0 );

}