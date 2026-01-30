#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	
	float x 	= uv.x;

	for(int i = 0; i < 32; i++)
	{
		if(i < int(mouse.x * 32.))
		{
			x *= (1.-x)*2.;
		}
	}
	
	x		= float(x>uv.y);
	
	gl_FragColor 	= vec4(x);

}