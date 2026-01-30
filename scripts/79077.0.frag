//enforcadito

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 12
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.4, .7);
	vec2 pp = sp*3.0;
	vec2 p = sp*3.0-vec2(20.0);
	vec2 i = p;
	float c = 1.0;
	float inten = 0.045;

	
	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t*0.8+length(pp*0.0) - i.x) + sin(t + i.y), sin(t*0.9+length(pp*5.0) - i.y) + cos(t*-1.9 + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
		pp*=1.054;
		p*=1.0;
	}
	c /= float(MAX_ITER);
	c = 1.0-sqrt(c);
	gl_FragColor = vec4(c*1000.0,c*0.0,c*0.0,c);
}
