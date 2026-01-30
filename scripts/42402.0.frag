#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float dia(in vec2 p) {
	float a = atan(p.y, p.x);	
	float s = floor((abs(p.x) + abs(p.y)) * 50.);
	s *= sin(s * 24.0);
	float s2 = fract(sin(s));
	
	float c = step(.9, tan(a + s + s2 * time) * .5 + .5);
	
	c *= s2 * .7 + .5;
	return c;		
}


void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) - .5;
	p.x *= resolution.x / resolution.y;
			
	
	
	gl_FragColor = vec4(dia(p), dia(p), dia(p),2.0);

}