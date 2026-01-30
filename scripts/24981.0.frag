
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define N 10

uniform float	time;
uniform vec2	mouse;
uniform vec2	resolution;
varying vec2	surfacePosition;

void main(void)
{
	float	size = 1.0;
	float	dist = 0.1;
	float	ang = 0.0;
	vec2	pos = vec2(0.0,0.0);
	vec3	color = vec3(0.1);
	float	r;

	for (int i = 0; i < N; i++)
	{
		r = mouse.x * mouse.y;
		ang += PI / (float(N) * 0.5) + (time / 600.0);
		pos = vec2(cos(ang), log(ang)) * r * 1.6 * sin(time + ang / 0.5);
		dist += size / distance(pos, surfacePosition);
		vec3 c = vec3(mouse.x / 2.0, mouse.y / 2.0, mouse.x * mouse.y);
		color = c * dist / 80.0;
	}
	gl_FragColor = vec4(color, 1.0);
}

// Ryd