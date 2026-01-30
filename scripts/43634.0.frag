// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 7
void main( void ) {
	float time_new = mouse.x / 1.;

	vec2 p = surfacePosition*4.0;
	vec2 i = p;
	i.x=i.x+1.5+sin(time_new*0.5)*3.;
	float c = 0.0;
	float inten = 0.15;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time_new * (1.0 - (1.0 / float(n+1)));
		i = p + vec2(
			cos(t*1.1 + i.x*1.75+sin(time_new*1.77-t)*2.3) - sin(t*1.3 + i.y*1.1+sin(time_new*2.77-t)*2.3), 
			sin(t*0.99 + i.y*1.66+sin(time_new*1.475-t)*2.3) + cos(t*1.78 + i.x*1.41+sin(time_new*2.1-t)*2.)
		);
		c += 1.0/length(vec2(
			(sin(i.x+t)/inten),
			(cos(i.y+t)/inten)
			)
		);
	}
	c /= float(MAX_ITER);
	
	gl_FragColor = vec4(c*vec3(2.3, 2., 2.5)-0.15, 1.0);
}