#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
int DEPTH = 10;

void main()
{
	vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution;
	position.x *= resolution.x / resolution.y;
	
	
	float cx = -2.0 + (position.x / resolution.x) * 4.0;
	float cy = -2.0 + (position.y / resolution.y) * 4.0;
	
	//std::complex<double> C(zoom * cx + (scrollX), zoom * cy + (scrollY)), Z = C;
	
	float Zx, Zy, Cx, Cy;
	
	float temp = Zx * Zx - Zy * Zy + Cx;
	Zy = 2.0 * Zx * Zy + Cy;
	Zx = temp;
		
	bool escaped = false;
	int breakDepth = 0;

	for(int i = 0; i < DEPTH; i++)
	{
		if(Zx > 4.0)
		{
			escaped = true;
			breakDepth = i;
			break;
		}
	}

	if(escaped)
	{
		gl_FragColor = vec4(breakDepth);

	}
	else
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	};
	
}


/*

temp = Zx * Zx - Zy * Zy + Cx
Zy = 2 * Zx * Zy + Cy
Zx = temp
x and y representing the real and imaginary parts of Z and C

*/}