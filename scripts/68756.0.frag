// Remixed by https://www.dwitter.net/u/danny@hille.dk
// Original by BELLEND http://glslsandbox.com/e#68739.1
// 
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
#define MAX_ITER 4.0

void main( void ) {

	vec2 p = surfacePosition*8.0 + mouse*10.;
	vec2 i = p;
	float c = 0.0;
	float inten = 0.15;
	float r = length(p+vec2(sin(time/9.),sin(time*0.033+9.)));
	float d = length(p);

	for (float n = 0.0; n < MAX_ITER; n++) {
		p*=rotate(d+time+p.x*.5)*-0.1;
		float t = r-time;
		      t = r-time;
		i -= p + vec2(
			cos(t/7. - i.x) + sin(t/9. + i.y),
			sin(t/111. - i.y) + cos(t/9. + i.x)+r
		);
		c += 1.0/length(vec2(
			(sin(i.x+t/9.)/inten),
			(cos(i.y+t/9.)/inten)
			)
		);

	}
	c /= float(MAX_ITER);
	gl_FragColor = vec4(vec3(c,c,c)*vec3(4.3, 3.8, 2.2)-0.615, .1);
}
