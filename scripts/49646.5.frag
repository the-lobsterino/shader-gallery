#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p =  800.0/( gl_FragCoord.xy-gl_FragCoord.yx*(2.*abs(sin(time))))+20.0+time*0.002 ;

	 
	vec3 col = 0.5 + 0.5*cos(20.*time+p.xyx+vec3(0,2,4));//ST
	
	gl_FragColor = vec4(col/p.y, 1.0 );

}