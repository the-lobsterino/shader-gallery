// Just for fun
// I just take a shader written by someone and change something.

// So before using this shader in your projects,
// please make sure it can't be optimized significantly.
// me2beats, 2018

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 8

void main( void ) {
	vec2 p = surfacePosition*10.0;
	vec2 i = p;
	float c = .1;
	float inten = 5.;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time;
		i = p + vec2(cos(t - i.x) + cos(t + i.y), (t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (cos(i.x+t)*inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	float pulse = .1;
	float pulse2 = .1;
	float pulse3 = .1;
	gl_FragColor = vec4(vec3(pow(c,1.5+pulse/2.))*vec3(1.0+pulse2, 2.0-pulse, 1.5+pulse3)*(1.+pulse)/2., 1.0);

}