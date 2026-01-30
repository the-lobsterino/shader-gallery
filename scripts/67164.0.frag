#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define TEARS 10

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int mod(int a, int n)
{
	return (a - (n * int(a/n)));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

	float color = 0.0;
	for(int i = 0; i < TEARS; i++)
	{
		if (mod(i,2) == 0)
		{
			color += float(i/TEARS) + position.x ;
		}
		else
		{
			color += float(i/TEARS) - position.x;
		}
		color += float(i/TEARS) + position.y;
	}
	
	gl_FragColor = vec4(color, color, color, 1.0);

}