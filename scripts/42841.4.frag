#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float color=0.05;
float color1=0.05;
float color3=0.05;
float delta_time;
void main( void ) 
{

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	delta_time+=abs(sin(time/0.5))/3.;
	
	color1=smoothstep(0.1,0.9,position.y/2.);
	if (delta_time+position.x-0.275>0.46&&(delta_time+position.x+0.1)<0.85)
	{
	color+=smoothstep(1.1,0.3,delta_time*position.x*position.y/2.);
	}
	else
	{
	 color=smoothstep(0.1,0.35,(0.5-position.y));	
	}
	if (delta_time+position.y-0.275>0.45&&(delta_time+position.y+0.1)<0.85)
	{
	color1+=smoothstep(1.03,0.35,delta_time*position.y);
	}
	else
	{
	 color1+=smoothstep(0.1,0.35,(0.5-position.x));	
	}
	
	if (delta_time+position.y*position.x-0.315>0.41&&(delta_time+position.y*position.x+0.1)<0.85)
	{
	color3+=smoothstep(1.03,0.35,delta_time*position.y*position.x);
	}
	else
	{
	 color3+=smoothstep(0.1,0.35,(0.5-position.x));	
	}
	gl_FragColor = vec4(vec3(color3,color1,color), 1.);
	
	

}