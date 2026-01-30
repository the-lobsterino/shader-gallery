// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 10
void main( void ) {

	vec2 p = surfacePosition*8.0;
	vec2 i = p;
	float c = 0.0;
	float inten = 0.2;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * (1.0 - (1.0 / float(n+1)));
		i = p + vec2(
			cos(t - i.x) + sin(t + i.y), 
			sin(t - i.x) + cos(t + i.y)
		);
		c += 1.0/length(vec2(
			p.x / (sin(i.x+t)/1.0-inten),
			p.y / (cos(i.y+t)/1.0-inten)
			)
		);
		c -=dot(1.0-c,c);
	}
	c /= float(MAX_ITER);
	
	//gl_FragColor = vec4(vec3(pow(c,.25))*vec3(0.75+c, 0.7, 0.1-c), 1.0);
	gl_FragColor = vec4(vec3(pow(c,.25))*vec3(c, c, c), 1.0);
}