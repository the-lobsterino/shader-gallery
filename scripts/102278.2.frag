#ifdef GL_ES
precision mediump float;
#endif

#define N 3

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 points[N];
	
void main( void ) 
{
	vec2 position = gl_FragCoord.xy / resolution.xy -0.5;	
	position.x *= resolution.x / resolution.y;

	points[0] = vec2(0.0, 0.0);
	points[1] = vec2(sin(time * 0.1), 0.0) * 1.0;
	points[2] = vec2(-sin(time * 0.1), 0.0) * 1.0;
	
	float color = 0.0;
	
	for (int i = 0; i < N; i++)
	{
		vec2 delta = position - points[i];
		float dist = length(delta) * 50.0;
		
		color += sin(dist);
	}
	
	gl_FragColor = vec4(color, color, color, 1.0);
}