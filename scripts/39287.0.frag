precision highp float;

const float pi = 3.141592653;

const float amount = 1.0;

varying vec2 surfacePosition;

uniform float time;



void main()
{
	vec4 color = vec4(0.5*sin(time), 0.3*sin(time + 1.0) , 0.2*sin(time + 2.0), 1.0);
	
	for (float a = 0.0; a < amount; a++)
	{
		if( (surfacePosition.x)*(surfacePosition.x) + (surfacePosition.y)*(surfacePosition.y) < abs(sin(time)) * 0.1 + 0.05)
			color += sin(time + time*surfacePosition.x / 1.5) + sin(time + time*surfacePosition.y / -1.4);
	}
	
	gl_FragColor = color;
}