#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void )
{
	if (length(gl_FragCoord.xy - mouse.xy*resolution.xy) <= 1.0)
	{
		gl_FragColor = vec4(1.0);
		return;
	}
	
	
	vec4 neighbours = vec4(0.0);
	for (float x=-1.0; x<=1.0; x++)
	{
		for (float y=-1.0; y<=1.0; y++)
		{
			neighbours += texture2D(backbuffer, (gl_FragCoord.xy + vec2(x, y))/resolution.xy);
		}
	}
	neighbours -= texture2D(backbuffer, gl_FragCoord.xy);
	
	if (neighbours.x < 5.0)
	{
		neighbours += texture2D(backbuffer, gl_FragCoord.xy);
		if (neighbours.x >= 3.0)
		{
			gl_FragColor = vec4(1.0);
			return;
		}
	}
	gl_FragColor =0.1/ vec4(vec3(0.0), 1.0);
}