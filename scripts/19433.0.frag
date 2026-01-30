#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x, float y)
{
	return fract(sin(dot(vec2(x, y), vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	float x = position.x;
	float y = position.y;
	
	float a = rand(x, y) + rand(x+1.0, y) + rand(x, y+1.0) + rand(x+1.0, y+1.0) + rand(x-1.0, y) + rand(x, y-1.0);
	float b = rand(x,y) + rand(x+0.23,y) + rand(x,y+0.23) + rand(x+0.23,y+0.23) + rand(x-0.23,y) + rand(x,y-0.23);
    	float r = 2.0*atan(b,a)/3.14159265359;
	
	gl_FragColor = vec4(r, r, a, 1.0);
}