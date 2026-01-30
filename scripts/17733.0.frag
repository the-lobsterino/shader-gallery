
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 25
void main( void ) {
vec2 p = surfacePosition*4.0/cos(length(surfacePosition));
	vec2 i = p;
	float c = 0.0;
	float inten = 1.0;
	if(1==1){
		inten=4.0;
	}

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * 0.04 * (1.0 - (1.0 / float(n+1)));
		i = p + vec2(
			cos(t - i.x) + sin(t + i.y), 
			sin(t - i.y) + cos(t + i.x)
		);
		c += 1.0/length(vec2(
			1.0 / (sin(i.x+t)/inten),
			1.0 / (cos(i.y+t)/inten)
			)
		);
	}
	c /= float(MAX_ITER);
	
	gl_FragColor = vec4(vec3(pow(c, 1.1), pow(c, 3.0), pow(c, 0.2)), 1.0);
}