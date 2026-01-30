#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	position.x = position.x * (resolution.x / resolution.y );
	
	vec3 color = vec3(.8,.8,.8);
	float ratio = resolution.x / resolution.y ;
	
	float mouseX = mouse.x * ratio;
	
	float radius = 0.02;
			
	vec2 center = vec2(mouseX + sin(time * 5.0) * .1,mouse.y+cos(time* 5.0) * .1);
	
	if(pow((position.x - center.x ),2.0) + pow((position.y - center.y),2.0) < pow(radius,2.0))
	{
		color = vec3(0.1 + sin(time),0.1+cos(time),0.1- sin(time));		
	}	

	
	// ikinci daire

	center = vec2(mouseX + sin(time * 3.0) * .15,mouse.y+cos(time* 3.0) * .15);

	
	if(pow((position.x - center.x ),2.0) + pow((position.y - center.y),2.0) < pow(radius,2.0))
	{
		color = vec3(0.1 + sin(time),0.1+cos(time),0.1- sin(time));		
	}	
	// ucuncu daire
	center = vec2(mouseX + sin(time * 5.0) * -.1,mouse.y+cos(time* 5.0) * -.1);

	
	if(pow((position.x - center.x ),2.0) + pow((position.y - center.y),2.0) < pow(radius,2.0))
	{
		color = vec3(0.1 + sin(time),0.1+cos(time),0.1- sin(time));		
	}	
	
	
	
	gl_FragColor = vec4( color, 1.0 );

}