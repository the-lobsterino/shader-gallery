#ifdef GL_ES
precision mediump float;
#endif

// modified by @hintz
// modified by @quilime 



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define TWO_PI (PI * 2.0)
#define N 7.0

void main(void) 
{
	vec2 v = (gl_FragCoord.xy - resolution) / min(resolution.y,resolution.x) * 25.0;

	float col = 0.1;

	for(float i = 0.0; i < N; i++) 
	{
	  	float a = i * (TWO_PI/N);
		col += cos(TWO_PI*(v.x * cos(a) + v.y * sin(a)+ mouse.y +i*mouse.x + sin(time*0.001)*100.0 ));
	}
	
	 col /= 1.0;

	gl_FragColor = vec4(col, col, col, 1.0);


}