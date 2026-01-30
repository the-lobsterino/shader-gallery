precision highp float;

const float pi = 3.141592653;

const float amount = 10.0;

varying vec2 surfacePosition;

uniform float time;



void main()
{
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
	
	for (float a = 0.0; a < amount; a++)
	{
		color += amount / pow(length(surfacePosition - vec2(cos(time + a * pi / amount * 2.0) / 3.0, sin(time * 2.0 + a * pi / amount * 2.0) / 3.0)) * 100.0, 2.0);
	}
	
	gl_FragColor = color;
}