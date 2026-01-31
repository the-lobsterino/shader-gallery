//enforcadito

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 16
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.4, .7);
	vec2 pp = sp*(3.0+sin(time*0.1));
	sp.x += sin(sp.y*12.0+time)*0.03;
	vec2 p = sp*4.0-vec2(20.5);
	vec2 i = p;
	float c = 1.0;
	float inten = .045;

	
	for (int n = 0; n < 1; n++) 
	{
		float t = time * (1.0 - (2.0 / float(n+1)));
		i = p + vec2(cos(t*0.3+length(pp*1.0) - i.x+p.y*4.0) + sin(t + i.y), sin(t*0.9+length(pp*5.0) - i.y) + cos(t*0.5 + sin(time+i.x*1.4)));
		c += 1.0/length(vec2(p.x / (sin(length(pp*2.0)+i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
		pp*=1.075;
		p*=1.05;
	}
	
	c = 1.3-sqrt(c);
	gl_FragColor = vec4(c*(0.6+length(pp*0.05)),c*0.9,c*1.3,c);
}