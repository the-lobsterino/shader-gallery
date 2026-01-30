// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 4
void main( void ) {

	vec2 p = surfacePosition*8.0;
	vec2 i = p;
	float c = 0.0;
	float inten = 0.5;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * (1.0 - (1.0 / float(n+1)));
		i = p + vec2(
			cos(t + i.x) - sin(t + i.y), 
			sin(t + i.y) + cos(t + i.x)
		);
		c += 1.0/length(vec2(
			(sin(i.x+t)/inten),
			(cos(i.y+t)/inten)
			)
		);
	}
	c /= float(MAX_ITER);
	
	gl_FragColor = vec4(c*vec3(0.5, 0.5, 1), 1.0);
}