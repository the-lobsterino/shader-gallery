#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 4
void main( void ) {
	vec2 sp = surfacePosition;
	vec2 p = sp * 5.0 - vec2(20.0);
	vec2 i = p;
	float c = 0.6;
	
	float inten = 1.0;
	
	float t = 0.0;
	
	for(int n = 0; n < MAX_ITER; n++)
	{
		t += (time * .05) * (1.0 - (4.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
	}
	
	gl_FragColor = vec4(vec3(c * c * c *c), 333.0) + vec4(0.0, 0.16, 0.09, .05);
}