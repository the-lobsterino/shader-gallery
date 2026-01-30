#ifdef GL_ES
precision mediump float;
#endif

#define Scale 100.0
#define Move vec2(-50.0, 0.0)
#define Color1 vec4(0.9, 0.9, 1.0 ,1.0)
#define Color2 vec4(0.5, 0.5, 0.5 ,1.0)


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle( vec2 p, float r )
{
	return length(p)-r;
}

void main( void )
{
	vec2 grid = vec2(0.692, 0.4) * Scale;
	float radius = 0.23 * Scale;
	vec2 p = gl_FragCoord.xy + (Move*time);
	radius *= 1.0-min(1.0, max(0.0, gl_FragCoord.x-200.0)/400.0);
	
	vec2 p1 = mod(p, grid) - grid*vec2(0.5);
	vec2 p2 = mod(p+grid*0.5, grid) - grid*vec2(0.5);
	float d1 = circle(p1, radius);
	float d2 = circle(p2, radius);
	float d = min(d1, d2);
	float c = d>0.0 ? 0.0 : 1.0;
	
	gl_FragColor = Color1*vec4(c) + Color2*vec4(1.0-c);
}
