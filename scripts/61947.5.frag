// B i f u r c a t i o n   d i a g r a m
// f o r   t h e   l o g i s t i c   m a p
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;



const int N = 1000;



void main()
{
	vec2 point = gl_FragCoord.xy / resolution.xy;
	
	float intensity = (0.1 + 0.05 * sin(5.0 * time)) * mouse.x;
	
	float x = 3.0 + point.x;
	float y = 1.0 - mouse.y;

	float value = 0.0;
	
	for (int i = 1; i < N; ++i)
	{
		y = x * y * (1.0 - y);
		
		value += intensity / (abs(point.y - y) * float(N));
	}
	
	vec3 color = vec3(value / 4.0, value, value / 2.0);

	gl_FragColor = vec4(color, 1.0);
}
