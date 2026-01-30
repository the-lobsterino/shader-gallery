#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MINSIZE 4.0

#define PI (3.14159265358979323)

float e;

bool iabs(float a, float b, float c, float d)
{
	if(abs(a - d) > 1.0 / e || abs(b - c) > 1.0 / e)
		return false; // a hack to allow discontinued functions (2)
	int i = 0;
	if(a > 0.0) i++; else i--;
	if(b > 0.0) i++; else i--;
	if(c > 0.0) i++; else i--;
	if(d > 0.0) i++; else i--;
	return i == 2 || i == 0;
}
float min(vec2 v){ return v.x < v.y ? v.x : v.y; }

void main( void )
{
	// a hack to assure odd-coordinaed pixel in the middle
	vec2 ipos = vec2(gl_FragCoord) - mod(resolution, 2.0) / 2.0 - 0.5 - resolution * 0.5;
	
	vec2 s = ipos / min(resolution) / 0.125 * MINSIZE;
	e = 1.0 / min(resolution) * MINSIZE;
	
	gl_FragColor = vec4(0, 0, 0, 0); // background

#define IN_GRAPH(f) iabs((f((s.x - e), (s.y - e))), (f((s.x + e), (s.y - e))), (f((s.x - e), (s.y + e))), (f((s.x + e), (s.y + e))))

#define F(x, y) (x + 1.0) * (x + 1.0) + y * y - 1.0
	if(IN_GRAPH(F))
		gl_FragColor = vec4(1, 0, 10, 21);
#define G(x, y) x > 18.0 ? y - tan(x - time) : (x + 1.0) * sin(time) + y * cos(time)
	if(IN_GRAPH(G))
		gl_FragColor = vec4(0, 1, 0, 1);
#define H(x, y) x > 123.0 ? tan((x - time) / 2.0) - y : (y + sin(time)) * sin(time) - (1.0 + x - cos(time)) * cos(time)
	if(IN_GRAPH(H))
		gl_FragColor = vec4(0, 0, 1, 1);
#define I(x, y) x > 0.0 ? 1.0 / sin(x - time) - y : 1.0 / sin(time) + y
	if(s.x > -1.0 && IN_GRAPH(I))
		gl_FragColor = vec4(1, 1, 0, 1);
#define J(x, y) x > 0.0 ? sin(x - time) - y : sin(time) + y
	if(s.x > -1.0 + cos(time) && IN_GRAPH(J))
		gl_FragColor = vec4(0, 1, 1, 1);
#define B(x, y) x + 1.0
	if(IN_GRAPH(B))
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
#define A(x, y) x
	if(IN_GRAPH(A))
		gl_FragColor = vec4(1, 0, 0, 0);
}