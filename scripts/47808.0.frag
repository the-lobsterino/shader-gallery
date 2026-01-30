precision mediump float;
uniform vec2 resolution;

bool rct(vec2 a, float b, float c, float d, float e)
{
	return a.x >= b && a.y >= c && a.x <= d && a.y <= e;
}

void main(void)
{
	float aspect = resolution.x / resolution.y;
	vec2 coords = (gl_FragCoord.xy / resolution - vec2(0.5, 0.5)) * vec2(max(1.0, aspect), max(1.0, 1.0 / aspect));
	
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	float w = 0.002;
	for(int i = 0; i < 2; i++)
	{
		if(rct(coords, -w, -0.5, w, 0.5) || rct(coords, -0.5, -w, 0.5, w))
		{
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			break;
		}
		
		if(rct(coords, -0.375, 0.125, -0.125, 0.375))
			coords = (coords - vec2(-0.25, 0.25)) * 4.0;
		else if(rct(coords, 0.0, 0.125, 0.25, 0.375))
			coords = (coords - vec2(0.125, 0.25)) * 4.0;
		else if(rct(coords, 0.25, 0.125, 0.5, 0.375))
			coords = (coords - vec2(0.375, 0.25)) * 4.0;
		else if(rct(coords, -0.5, -0.375, -0.25, -0.125))
			coords = (coords - vec2(-0.375, -0.25)) * 4.0;
		else if(rct(coords, -0.25, -0.375, 0.0, -0.125))
			coords = (coords - vec2(-0.125, -0.25)) * 4.0;
		else if(rct(coords, 0.0, -0.25, 0.25, 0.0))
			coords = (coords - vec2(0.125, -0.125)) * 4.0;
		else if(rct(coords, 0.25, -0.5, 0.5, -0.25))
			coords = (coords - vec2(0.375, -0.375)).yx * vec2(-4.0, 4.0);
		else 
			break;
		w = w * 2.5;
	}
}