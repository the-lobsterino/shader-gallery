#ifdef GL_ES
precision mediump float;
#endif

// modified by @hintz
// and then by zbr
// (i wonder who did the first version? it's great!)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define TWO_PI (PI* (2. + sin(time / 8000.)))
#define N 6.0

void main(void) 
{
	vec2 center = (gl_FragCoord.xy);
	vec2 p = (gl_FragCoord.xy / resolution);
//	center.x=-100.12*sin(time/10);
//	center.y=-100.12*cos(time/2.0);
	
	vec2 v = (gl_FragCoord.xy - resolution/120.) / min(resolution.y,resolution.x) * 25.0;
	v.x=v.x-10.0;
	v.y=v.y-200.0;
	float col = 0.0;

	for(float i = 0.0; i < N; i++) 
	{
	  	float a = i * (TWO_PI/N) * 61.95;
		col += sin(TWO_PI*(v.y * atan( i * 10.) * cos(a) / 10.+ v.x * sin(a) /*+ mouse.y +i*mouse.x*/ + sin(time*0.002)*40.0 ));
	}
	
	col /= 2.0;

	gl_FragColor = vec4(col*.4 * p.x * 3., -col*.9,-col*.4, 1.0);
}