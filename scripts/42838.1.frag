#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float color=0.05;
float color1=0.05;
float delta_time;
void main( void ) 
{

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	delta_time+=abs(sin(time/0.5))/3.;
	
	color1=smoothstep(0.1,0.9,position.y/2.);
	if (delta_time+position.x-0.275>0.35&&(delta_time+position.x+0.1)<0.75)
	{
	color+=smoothstep(0.1,0.5,delta_time*position.x*position.y/2.);
	}
	else
	{
	 color1=smoothstep(0.,0.3,(0.5-position.y));	
	}
	gl_FragColor = vec4(vec3(0.,color1, color), 1.);
	
	

}