#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 surfacePosition;

#define MAX_ITER 8
void main(  ) {
	vec2 p = surfacePosition*2.8- vec2(14.0);
	vec2 i = p;
	float c = 3.0;
	float inten = .14;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time + c*c/40.-p.x*0.2;
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.6-sqrt(c);
	gl_FragColor = vec4(vec3(c*c*c*c), 1.0) + vec4(0.0, 0.25, 0.65, 0.75);
}