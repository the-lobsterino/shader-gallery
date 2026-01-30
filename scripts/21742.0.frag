#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 8
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.25, .35);
	vec2 p = sp*1.0 + vec2(-0.0,-1.5);
	vec2 i = p;
	float c = 10.0;
	
	float inten = 0.1;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time/10.0* (1.0 - (1.0 / float(n+2)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t + i.y) + cos(t + i.x));
		c += 1.3/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y-t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.8-sqrt(c);
	gl_FragColor = vec4(vec3(c*c*c*c), 99.0) + vec4(0.2, 0.0, 0.5, 1.0);

}