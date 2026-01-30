#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ZOOM 8.0

vec2 viewPort() { return (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y) * ZOOM; }
bool parity(float a, float b, float c, float d) { int v = (a > 0.0 ? 1 : 0) + (b > 0.0 ? 1 : 0) + (c > 0.0 ? 1 : 0) + (d > 0.0 ? 1 : 0); return v == 1 || v == 2; }
#define STEP (ZOOM / min(resolution.x, resolution.y))
#define IN_GRAPH(C, F) parity(F(((C).x - STEP), ((C).y - STEP)), F(((C).x - STEP), ((C).y + STEP)), F(((C).x + STEP), ((C).y - STEP)), F(((C).x + STEP), ((C).y + STEP)))

float xaxis(float x, float y) { return x; }
float yaxis(float x, float y) { return (0.1 * y); }

void main()
{
	gl_FragColor = vec4(1, 1, 1, 1);
	vec2 coords = viewPort();
	if(IN_GRAPH(coords, xaxis) || IN_GRAPH(coords, yaxis))
		gl_FragColor = vec4(0, 0, 0, 1);
	
	#define F(x, y) asin(cos(x + time) + cos(y - time)) - y * x
	if(IN_GRAPH(coords, F))
		gl_FragColor = vec4(0, 0, .8, 1);
}