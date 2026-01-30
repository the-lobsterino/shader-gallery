#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




void main( void ) {

	vec2 p =gl_FragCoord.xy*0.5-mouse*1000.0;
	
	float r =sin(cos(p.y*0.10));
	
	float g = 2.0*sin(cos(p.x*cos(time)*sin(time)))*0.1+r;
	

	
	
	vec4 color = vec4(r,g,0.0,1.0);


	
	
	gl_FragColor = color;

}