#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//bsgo-bb8_ XD

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float m=distance(vec2(.5,.5),position) ;
	m=m*sin(gl_FragCoord.x*10.0)*cos(gl_FragCoord.y*10.0)*200.0 ;
	
	

	gl_FragColor = vec4( vec3( 0.0,0.0,10.0*sin(m)), 1.0 );

}