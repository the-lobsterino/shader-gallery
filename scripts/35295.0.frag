#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Demonstration of mandelbrot to friend
#define MAX_ITERATION 200

void main( void )
{
	vec2 c;
	c.x = (gl_FragCoord.x / resolution.x) * 4.0 - 3.0;
	c.y = (gl_FragCoord.y / resolution.y) * 3.0 - 1.5;
	vec2 z = vec2(0.0);
	bool escaped = false;
	for (int i=0; i<MAX_ITERATION; i++)
	{
		z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
		if (length(z) > 2.0)
		{
			escaped = true;
			break;
		}
	}
	if (escaped)
	{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
	else
	{
		gl_FragColor = vec4(1.0);
	}
}