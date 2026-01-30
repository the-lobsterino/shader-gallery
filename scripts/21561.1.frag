#ifdef GL_ES
precision mediump float;
#endif

// modified by @hintz

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.4159
#define TWO_PI (PI*5.0)
#define N 12.0

void main(void) 
{
	vec2 center = (gl_FragCoord.xy);
	center.x=-100.12*sin(time/250.0);
	center.y=-100.12*cos(time/100.0);
	
	vec2 v = (gl_FragCoord.xy - resolution/50.0) / min(resolution.y,resolution.x) * 25.0;
	v.x=v.x+200.0;
	v.y=v.y-200.0;
	float col = 0.0;

	for(float i = 0.0; i < N; i++) 
	{
	  	float a = i * (TWO_PI/N) * 61.95;
		col += cos(PI*(v.y * cos(a) + v.x * sin(a) + sin(time*0.04)*100.0 ));
	}
	
	col = col/2.5;
	vec3 u=vec3(col*2.4,col*0.5,0.0);
	if (u.x<0.0){u.x=1.0+u.x/abs(cos(PI*(sin(time*0.03)+sin(time*0.04))));}
	gl_FragColor = vec4(u, 1.0);
}