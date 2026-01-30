#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265358979
#define N 10

uniform float	time;
uniform vec2	mouse;
uniform vec2	resolution;
varying vec2	surfacePosition;
float r ;
float	dist =0.2;
float	ang =0.;

void setupAspect();	

struct Light 
{
	float	size ;
	vec2	pos ;
	vec3	color ;

};

void main(void)
{
	setupAspect();
	Light circle[N];

	for (int i = 0; i < N; i++)
	{
		circle[i] = Light(5., vec2(0.1, 0.), vec3(0.1));
		ang += PI / (float(N) * 0.5) + (time / 1000.0);
		circle[i].pos = vec2(cos(ang), log(ang)) * r * 1.6 * sin(time + ang / 0.5);
		dist += circle[i].size / distance(circle[i].pos, surfacePosition);
		vec3 c = vec3(mouse.x / 2.0, mouse.y / 2.0, mouse.x * mouse.y);
		circle[i].color = c * dist / 80.0;
		gl_FragColor = vec4(circle[i].color, 1.0);
		
	}
}

void setupAspect(){ 
    	r = mouse.x * mouse.y; 
}
