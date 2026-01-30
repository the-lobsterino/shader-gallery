// water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define MAX_ITER 2.0

float Turb(vec2 p)
{
	vec2 i = p;
	float c = 0.0;
	float inten = 0.15;
	float r = length(p+vec2(sin(time),sin(time*0.433+2.))*3.);
	
	for (float n = 0.0; n < MAX_ITER; n++) {
		float t = r-time * (1.0 - (1.9 / (n+1.)));
		      t = r-time/(n+0.6);//r-time * (1.0 + (0.5 / float(n+1.)));
		i -= p + vec2(
			cos(t - i.x-r) + sin(t + i.y), 
			sin(t - i.y) + cos(t + i.x)+r
		);
		c += 1.0/length(vec2(
			(sin(i.x+t)/inten),
			(cos(i.y+t)/inten)
			)
		);
	
	}
	c /= float(MAX_ITER);
	c = clamp(c,-1.0,1.0);
	return c;
	
}

void main( void ) {

	vec2 p = surfacePosition*12.0;
	float c = Turb(p);
	gl_FragColor = vec4(vec3(c,c,c),1.0);	//*vec3(2.4, 2.0, 2.5)-0.15, 1.0);
}