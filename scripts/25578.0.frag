#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535

#define MIN vec2(-PI, -PI / 2.0)
#define MAX vec2(PI, PI / 2.0)

#define P1 vec2(25.425613, 58.808352) / 180.0 * PI
#define P2 vec2(37.472197, 55.902558) / 180.0 * PI
#define P3 vec2(21.424890, 41.999090) / 180.0 * PI

float haversin(float x)
{
	float y = sin(x / 2.0);
	return y * y;
}

float dist(vec2 a, vec2 b)
{
	return haversin(a.y-b.y)+cos(a.y)*cos(b.y)*haversin(a.x-b.x);
}

int sgn(float x)
{
	if(x > 0.0)
		return 1;
	return -1;
}

bool map(float a, float b, float c, float d)
{
	int z = sgn(a) + sgn(b) + sgn(c) + sgn(d);
	return z == 2 || z == 0;
}

void main()
{	
	vec2 c = gl_FragCoord.xy / resolution.xy * (MAX - MIN) + MIN;
	float res_x = (MAX.x - MIN.x) / resolution.x;
	float res_y = (MAX.y - MIN.y) / resolution.y;
	float x = c.x;
	float y = c.y;
	gl_FragColor = vec4(0, 0, 0, 1);

#define MAP(F) map(F((x), (y)), F((x), (y + res_y)), F((x + res_x), (y)), F((x + res_x), (y + res_y)))

#define F(x, y) dist(vec2(x, y), P1) - dist(vec2(x, y), P2)
#define G(x, y) dist(vec2(x, y), P2) - dist(vec2(x, y), P3)
#define H(x, y) dist(vec2(x, y), P3) - dist(vec2(x, y), P1)
	gl_FragColor = vec4(MAP(F), MAP(G), MAP(H), 1);

}