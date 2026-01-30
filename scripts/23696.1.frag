// edit 2015-03-03
// ManutrickJC
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 18
void main( void ) {

	vec2 p = surfacePosition*1.*10.;
	vec2 i = p;
	float c = .09;
	float inten = 2.;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * (1.12 - (3. / float(n+1)));
		i = p + vec2(
			cos(t - i.x) + sin(t + i.y), 
			sin(t - i.x) + cos(t + i.y) 
		);
		c += pow(c,0.2)/length(vec2(
			p.x / (sin(i.x+t)/523.0-inten),
			p.y / (cos(i.y+t)/inten)
			)
		);
		c -=dot(0.23-c,c*0.2);

	}
	c /= float(MAX_ITER);
	c*=pow(c,1.4);
	gl_FragColor = vec4(vec3(pow(c,0.05))*vec3(.05, .05, .05), 0);
}