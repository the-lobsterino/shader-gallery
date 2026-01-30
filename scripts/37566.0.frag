#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	
	vec2 calMouse = vec2(mouse.x*3.51-1.9, mouse.y*2.5-1.1);
	vec4 color = vec4(0.0);
	for(float i = 0.0; i < 8.0; i++){

		 
		vec4 lightpos = vec4(calMouse.x+sin(time/2.0+i)/2.0,calMouse.y+cos(-time/2.0+i)/2.0,0.5,1.0);
		vec2 acceleration = (-lightpos.xy + calMouse);
		vec2 displacement = acceleration/pow(2.0,2.0);
		calMouse = displacement;
		vec2 position = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
		
		float distance1 = length(vec4(position,0.5,1.0) - lightpos);
		float alpha = pow(distance1,0.4);
		color += mix(vec4(sin(i),cos(i),0.5,1.0)/2.0,vec4(0),alpha);

	}
	gl_FragColor = color;

}