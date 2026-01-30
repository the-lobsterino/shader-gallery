#ifdef GL_ES
precision mediump float;
#endif

uniform float time;		//time in our shader
uniform vec2 mouse;		//mouse position vec2(x, y) SCREEN SPACE
uniform vec2 resolution;	//resolution

float green(float x)
{
	if(x < 0.25)
	{
		return 0.0;	
	}
	
	else if(x > 0.75)
	{
		return 0.0;	
	}
	
	else
	{
		return 1.0 - 4.0 * abs(x - 0.5);
	}
}

void main(void)
{
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	gl_FragColor = vec4(vec3(1.0 - position.x * 2.0, green(position.x), (position.x - 0.5) + (position.x - 0.5) * 2.0), 1.0);
}