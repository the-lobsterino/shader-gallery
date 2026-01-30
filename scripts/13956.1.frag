#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float speed = 1.0;

//#define MINSIZE (5.0 / (0.5 + abs(sin(time *speed))))
#define MINSIZE 5.0
#define PI (3.14159265358979323)

int isign(float v){ return v > 0.0 ? 1 : -1; }
int iabs(int v){ return v >= 0 ? v : -v; }
float min(vec2 v){ return v.x < v.y ? v.x : v.y; }

#define X(x, y) (y)
#define Y(x, y) (x)
#define XY(x, y) (x*y)
#define F(x, y) (sin(x) - y)
#define F1(x, y) ((x) - cos(y))
#define G(x, y) (abs(1.0 / x) - abs(y))
#define H(x, y) ((pow(x - 2.0, 2.0) + pow(y, 2.0) - 4.0) * (pow(x, 2.0) + pow(y + 3.47, 2.0) - 4.0))
#define J(x, y) (x * x * 0.2 - y)

#define A0(x, y)	( -epsilon - y + cos(5.*x*1.0)*0.1)
#define A1(x, y)	( -epsilon - y + cos(5.*x*0.5)*0.3)
#define A2(x, y)	( -epsilon - y + cos(5.*x*0.25 + 10.)*0.5)
#define A3(x, y)	( -epsilon - y + cos(5.*x*0.125)*0.6)

#define A4(x, y)	( -epsilon - y*1. + cos(5.*x*0.125)*0.6 + cos(5.*x*0.25 + 10.)*0.5 + cos(5.*x*0.5)*0.3 + cos(5.*x*1.0)*0.1)
void main( void )
{
	// a hack to assure odd-coordinated pixel in the middle
	vec2 ipos = vec2(gl_FragCoord) - mod(resolution, 2.0) / 2.0 - 0.5 - resolution * 0.5;
	
	vec2 screenpos = ipos / min(resolution) / 0.5 * MINSIZE;
	float epsilon = 1.0 / (resolution.x < resolution.y ? resolution.x : resolution.y) * MINSIZE;
	
	//gl_FragColor = vec4(0, 0, 0, 0); // background
	
	// GLSL's stupid preprocessor can't do a thing, so i have to feature this lengthy macro
#define IN_GRAPH(f) (iabs(isign((f((screenpos.x - epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x - epsilon), (screenpos.y + epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y + epsilon))))) != 4)
	
// Coordinates
	if (IN_GRAPH(XY))	gl_FragColor = vec4 (1.0, 1.0, 1.0, 1.0);

// Test
	if (IN_GRAPH(A0))	gl_FragColor = vec4 (0.5, 1.0, 0.5, 1.0);
	if (IN_GRAPH(A1))	gl_FragColor = vec4 (0.5, 1.0, 0.5, 1.0);
	if (IN_GRAPH(A2))	gl_FragColor = vec4 (0.5, 1.0, 0.5, 1.0);
	if (IN_GRAPH(A3))	gl_FragColor = vec4 (0.5, 1.0, 0.5, 1.0);

	if (IN_GRAPH(A4))	gl_FragColor = vec4 (1.0, 0.0, 0.0, 1.0);
}