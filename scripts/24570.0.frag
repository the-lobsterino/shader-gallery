#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//no, no reason

float crapnoise ( float x ) {
	return x + .5 * sin(x);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	p.x = (resolution.x * p.x) / resolution.y;

	float c = 0.0;
	float f = .0050;
	p.x += sin(p.x * 7.5 + time * .2) * .05;
	
	for( int i = 0; i < 1; i++ ) {
		f *= 1.1;
		p.y += .05;
		p.x = crapnoise(p.x);
		p.x += time * .5;
		float l1 = p.y;
		l1 += sin(p.x * 2.) * .125 + 0.025 * sin(time* 2. + p.x * 15.);
		l1 = clamp( l1, 0.0, f);
		l1 = mod( l1, f) / f;
		l1 = 1. - .25 / (l1*l1);
		c = max(l1,c);
	}
	
	gl_FragColor = vec4( c, c * .5 , c * .25, 1. );

}