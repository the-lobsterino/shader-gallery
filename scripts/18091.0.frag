#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.1415926;
float t = time *.05;
float formula(float x)
{
					
	return .3 * sin(.15*PI*(-t+x))+ .1 * cos(12.0*PI*(-t+sin(2.0 * PI * (x - t)))) + .1*sin(PI*32.0*(x+2.0*t));
}	
void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float px = 1.0/ resolution.x;
	float py = 1.0 / resolution.y;
	vec4 color = vec4(1.0,1.0,1.0,1.0);
	

	float x = (uv.x - .5);
	float y = formula(x);


	
	float modX = floor(.5+10.0*(uv.x-.5)) / 10.0;
	float fmodX = formula(modX);
	
	float avg = 1.0;
	float screen_y = 10.0;
	float stroke = 3.0;
	float dist = 0.0;
	for (float step_x = -1.0; step_x < 1.0; step_x += .1)
	{
		x = (uv.x - .5 +stroke*(-step_x)*px);
		
		for (float step_y = -1.0; step_y < 1.0; step_y += .1)
		{
			
			y = formula(x);
			screen_y = uv.y + stroke*(-step_y)*py;
			dist = step_x*step_x + step_y*step_y;
			dist /= stroke*stroke;
			avg += (1.0 - min(1.0,(abs(screen_y-.5  - .5*y)/py))) /dist;
		}
	}
	avg /= 100.0;
	color.r -= avg;
	color.g -= avg;	
	color.b -= avg;
	gl_FragColor = color;
}