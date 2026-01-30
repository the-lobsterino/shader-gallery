// 010820N Pseudo 3D sea

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
// uniform vec2 mouse;
varying vec2 surfacePosition;

#define MAX_ITER 12
void main( void ) {
	vec2 mouse = vec2(0,0);
	vec2 sp = surfacePosition;

	vec2 p;
	p.x = sp.x*5.0 - 10.0;
	p.y = sp.y*5.0 - 10.0*log(-sp.y);
	
	vec2 i = p;
	float c = .6;	
	float inten = .05;
	float t=0.0;
	for (int n = 0; n < MAX_ITER; n++) 
	{
		t += (length(mouse)+100.+time * 0.25) * (0.0 - (1.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));

		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.4-sqrt(c);

	vec4 bc =  vec4(0.2, 0.3, 0.2, 1.0);

	// if (p.x >= sp.x - 12. && p.x <= sp.x - 9.)
		// bc += vec4(0.2, .9, 0.2, 1.0);

	gl_FragColor = vec4(vec3(c*c*c*c), 1.0) + bc;

}