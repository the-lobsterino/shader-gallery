//An attempt at chaos. Precision of colors isn't great enough though. TLM


#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) 
{
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec4 me = texture2D(backbuffer, position);
	
	if(mouse.x < 0.3)
	{
		vec4 color = vec4(1.0);
		
		if (position.x > 0.5)
		{
			color = vec4(0.25, 0.25, 0.25, 1.0);
		}
		else
		{
			color = vec4(0.25, 0.25, 0.25, 1.0);
			color += 0.001;
		}
		gl_FragColor = color;
		return;
	}

	me.r = fract(3.0*me.r);
	me.g = fract(3.0*me.g); 
	me.b = fract(3.0*me.b);


	
	gl_FragColor = me;
}
