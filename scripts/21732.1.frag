#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 32
void main( void ) {
	vec2 sp = 2.5*surfacePosition;//vec2(.25,.35);
	vec2 p = sp*2.0 + vec2(0.0,0.1);
	vec2 i = p;
	float c = 10.0;
	
	float inten = 0.1;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time/19.0* (3.0 - (8.0 / float(n+2)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t + i.y) + cos(t + i.x));
		c += 3.2/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y-t)/inten)));
	}
	c /= float(MAX_ITER)*0.125;
	c = 5.8-sqrt(c);
	gl_FragColor = vec4(vec3(1.-pow(c*c*1.125, .2)), 999.0) + vec4(0.1, 0.9, 0.1, 1.0);

}