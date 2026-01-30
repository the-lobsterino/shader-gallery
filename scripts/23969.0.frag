#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define white vec4(1,1,1,1);
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;//+ mouse / 4.0;
	float t = time * 5.0;
	int xt = int(t);
	t -= float(xt);
	if (t > 0.5) t = 1.0 - t;
	t *= 2.0;
	int xt3 = xt / 3;
	xt -= (xt3 * 3);
	float r,g,b;
	if (xt == 2) r = t;
	else if (xt == 1) g = t;
	else b = t;
	
	if (position.x < .75 && position.x > 0.25 && position.y < 0.9 && position.y > 0.1)
	{
		if (position.x > 0.505)
		{
			if (position.y > 0.51) gl_FragColor = vec4(r,g,b,1);
			else if (position.y < 0.49) gl_FragColor = vec4(g,r,b,1);
				else gl_FragColor = white;
		}
		else if (position.x < 0.495)
		{
			if (position.y > 0.51) gl_FragColor = vec4(r,b,g,1);
			else if (position.y < 0.49) gl_FragColor = vec4(b,g,r,1);			
				else gl_FragColor = white;
		}
		else gl_FragColor = white;
	}
	gl_FragColor *= length(mouse - vec2(0.5,0.5));
}