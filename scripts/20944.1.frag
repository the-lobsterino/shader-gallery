#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	float t = .05 * time + .3;
	mat2 r = mat2(cos(t),-sin(t),sin(t),cos(t));
	vec4 p = abs(4.-8.5*gl_FragCoord.xyxz / resolution.x), c=p*.0;
	p.yx *= r;
	for (float d=.2;d<2.;d+=.28) {
		p -= .5*d;
		for (int i=0;i<64;i++) p.xy=r*(p.xy+sign(p.yx)*vec2(-.2,.46));
		c += .25*p;
	}
	
	gl_FragColor = c*0.9;

}