#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	/*
	z	= x + iy
	2z^2	= x^2 + i2xy - y^2
	c	= x0 + iy0
	
	x	= Re(z^2 + c)	= x^2 - y^2 + x0
	y	= Im(z^2 + c)	= 2xy + y0
	*/
	
	vec2 position = ((gl_FragCoord.xy - resolution.xy/2.)/resolution.xy);
	float stretchX = resolution.x / resolution.y;
	
	float x0 = stretchX * position.x / 0.5;
	float y0 = position.y / 0.5;
	float x = 0.;
	float y = 0.;
	int iteration = 0;
	const int max_iteration = 50;
	
	for (int i = 0; i < max_iteration; i++) {
		if(x*x + y*y < (sin(time)*2. + 2.)) {
			float xtmp = x*x - y*y + x0;
			y = 2.*x*y + y0;
			x = xtmp;
			iteration ++;
		}
		else break;
	}
	
	vec4 top = vec4(2.0, 0.8, 0.8, 1.);
	vec4 bottom = vec4(0., 0.0, 0.2, 1.);
	
	gl_FragColor = vec4(mix(bottom, top, float(iteration)/float(max_iteration)));
}