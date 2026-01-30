#ifdef GL_ES
precision mediump float;
#endif

//are the defines for type independence?
//style?
//do they actually get optimized at compile time?
//mysteries...


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MINSIZE 2.
#define pi 4./atan(1.)

int isign(float v){ return v > 0.0 ? 1 : -1; }

int iabs(int v){ return v >= 0 ? v : -v; }


float min(vec2 v){ return v.x < v.y ? v.x : v.y; }

void main( void )
{
	vec2 uv = gl_FragCoord.xy-resolution.xy;
	
	// a hack to assure odd-coordinaed pixel in the middle
	vec2 ipos = vec2(gl_FragCoord) - mod(resolution, 2.0) / 2.0 - 0.5 - resolution * 0.5;
	
	vec2 screenpos = ipos / min(resolution) / 0.5 * MINSIZE;
	float epsilon = 1.0 / (resolution.x < resolution.y ? resolution.x : resolution.y) * MINSIZE;
	
	gl_FragColor = vec4(0.);
	
	// GLSL's stupid preprocessord can't
	// do a thing, so i have to feature
	// this lengthy macro
	//#define t time 
	#define IN_GRAPH(f) iabs(isign((f((screenpos.x - epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y - epsilon)))) + isign((f((screenpos.x - epsilon), (screenpos.y + epsilon)))) + isign((f((screenpos.x + epsilon), (screenpos.y + epsilon))))) != 4

	#define m mouse
	
	//#define F(x, y) (m.g+x)-(m.r+y)+.5
    #define F(x, y) (m.r-x)
    if(IN_GRAPH(F))
		gl_FragColor = vec4(.5, 0, 0, 1);

	//#define G(x, y) (m.g-y)-(x-m.r)-.5
    #define G(x, y) (m.g-y)-.5
    if(IN_GRAPH(G))
		gl_FragColor = vec4(0, .5, 0, 1);
	
	#define p0  128.
	#define r0 32.
	#define H(x, y) pow(F(x, y), p0) + pow(G(x, y), p0) - fract(y + x * r0) + cos(time)
	if(IN_GRAPH(H))
		gl_FragColor = vec4(0, 1, 0, 1);

	#define p1  2.
	#define r1 32.
	#define I(x, y) min(H(x, y), pow(F(x, y + 1.), p1) + pow(G(x, y), p1) - fract(y + x * r1) - cos(time))
	if(IN_GRAPH(I))
		gl_FragColor = vec4(0, 0, 1, 1);
}//sphinx + whatever mathlete posted this define code