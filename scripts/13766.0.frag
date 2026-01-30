#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MINSIZE 7.0

#define PI (3.14159265358979323)

int isign(float v){ return v > 0.0 ? 1 : -1; }

int iabs(int v){ return v >= 0 ? v : -v; }

float min(vec2 v){ return v.x < v.y ? v.x : v.y; }

void main( void )
{
	// a hack to assure odd-coordinaed pixel in the middle
	vec2 ipos = vec2(gl_FragCoord) - mod(resolution, 2.0) / 2.0 - 0.5 - resolution * 0.5;
	
	vec2 screenpos = ipos / min(resolution) / 0.5 * MINSIZE;
	float epsilon = 1.0 / (resolution.x < resolution.y ? resolution.x : resolution.y) * MINSIZE;
	
	gl_FragColor = vec4(0, 0, 0, 0); // background
	
	if(abs(screenpos.x) < epsilon) // X axis
		gl_FragColor = vec4(1, 0, 0, 1);
	if(abs(screenpos.y) < epsilon) // Y axis
		gl_FragColor = vec4(0, 1, 0, 1);
	
	// GLSL's stupid preprocessord can't
	// do a thing, so i have to feature
	// this lengthy macro
#define IN_GRAPH(f) iabs(isign((f((screenpos.x - epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x - epsilon), (screenpos.y + epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y + epsilon))))) != 4

#define F(x, y) sin(x * 10.0) * x / 10.0 - y
	if(IN_GRAPH(F))
		gl_FragColor = vec4(1, 0, 1, 1);
	
#define G(x, y) abs(1.0 / x) - abs(y)
	if(IN_GRAPH(G))
		gl_FragColor = vec4(0, 1, 1, 1);

#define H(x, y) (pow(x - 2.0, 2.0) + pow(y, 2.0) - 4.0) * (pow(x, 2.0) + pow(y + 3.47, 2.0) - 4.0)
	if(IN_GRAPH(H))
		gl_FragColor = vec4(1, 1, 0, 1);

// we use mouse.r/g synonyms here because x is already taken
#define J(x, y) x * x * 0.2 + x * (mouse.r * -4.0 + 2.0) - (mouse.g * -4.0 + 2.0) - y
	if(IN_GRAPH(J))
		gl_FragColor = vec4(1, 1, 1, 1);
}