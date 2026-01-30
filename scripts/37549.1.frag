#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circles ( vec2 p, vec2 posc){
	
	vec2 pos = vec2(
		 2.0* mouse.x-1.0,
	         2.0* mouse.y-1.0);
		
	return length(p-pos);
}
	


void main( void ) {

	vec2 p = 2.0*
	( gl_FragCoord.xy / resolution.xy )-1.0;

	p.x*= resolution.x/resolution.y;
	vec3 bgcolor=vec3(0);
	vec3 color=vec3(0,0,0);
	vec2 posc=vec2(0);
	
		
	/* posc = vec2   (0.10+0.90*sin(time*1.0),			  
		         (0.10+0.0*cos(time*1.0)));
	*/
	
	color.r=smoothstep(length(p-posc),
			   length(p-posc)-.01,
			   0.5);
	
	color.g=smoothstep(circles(p,posc),
		0.02+.01*(cos(time*9.50)),0.75);
	
	color.b=step(circles(p,posc),
		0.015+.015*(cos(time*8.0)));
	
		
	gl_FragColor = 
	vec4(mix(bgcolor,color,1.75), 1.0 );
	

}












