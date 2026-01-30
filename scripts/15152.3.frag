// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
// Altered
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 10
void main( void ) {
	vec2 p = surfacePosition*8.0- vec2(0.0);
	p *= 10.;
	p.x -= 3.*atan(p.y*mouse.x)*sign(p.x);
	
	vec2 i = p;
	float c = 1.0;
	float inten = .03;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (1.1 / float(n+1)));
		i = p*10. + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) - cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.5-sqrt(c);
	gl_FragColor = vec4(vec3(1.-pow(c,2.*mouse.y)), 19.0) + vec4(0.7, 0.2, 0.3, 1.0);
}