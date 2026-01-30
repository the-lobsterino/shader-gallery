#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 p = (gl_FragCoord.xy / resolution.x - vec2(0.65, 0.25)) * 4.5;
	
	vec2 z1 = p-mouse;

	float hue = 0.9;
	vec4 color = vec4(0, 0, 0.4, 1);
	for(int i = 0; i < 20; i++)
	{
		if(length(p) > 2.0)
		{
			color = vec4(cos(hue) + 0.7, sin(hue + 2.0) + 0.5, cos(hue + 4.0) + 0.5, 1);
			break;
		}

		p = vec2(z1.x * z1.x - z1.y * z1.y, 2.0 * z1.x * z1.y) + p;

		hue += 0.16;
	}
	gl_FragColor = color;
}