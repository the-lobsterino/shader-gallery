#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

 

#define s 11132.



  

void main( void ) {
	vec3 p = gl_FragCoord.xyz ;
	 
	
	p.x  =  pow( sin(time+p.y/100.),2.)+pow( cos(time+p.x/100.),2.);
	p.y  =   sin(time+p.y/100.)/cos(time+p.x);
	p.z  =   sin(time+p.x/100.)/cos(time+p.y);
	
	gl_FragColor = vec4(p, 1.0) ;
}