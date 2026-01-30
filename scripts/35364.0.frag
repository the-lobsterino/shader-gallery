#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	int iterations = 50;
	float boundLimit = 6.8;
	float zoom = 1.0;
	float xOffset = 4.6;// + mouse.x;
	float yOffset = 1.50;// + mouse.y;
	vec2 c;
	//c.x = (gl_FragCoord.x / resolution.x) * (3.0 / zoom) - 2.25;
	//c.y = (gl_FragCoord.y / resolution.y) * (3.0 / zoom) - 1.5;
	c.x = (gl_FragCoord.x / resolution.x) * (6.0 / zoom) - (xOffset / zoom);
	c.y = (gl_FragCoord.y / resolution.y) * (3.0 / zoom) - (yOffset / zoom);
	vec2 z = vec2(0.0);
	float lz = 0.0;
	bool outOfBounds = false;
	for (int i=0; i < 22; i++)
	{
		z = vec2(0.25*z.x*z.x - 1.2*z.y*z.y + 1.1*sin(c.x), 1.3*z.x*z.y + 1.15*c.y);
		lz = length(z);
		if (lz > boundLimit)
		{
			outOfBounds = true;
			break;
		}
	}
	if (outOfBounds)
	{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
	else
	{
		gl_FragColor = vec4(cos(lz)/2.0,sin(lz/2.0),tan(lz/1.5),0.75);
	}

}