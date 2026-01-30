#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dia(in vec2 p) {
	float a = atan(p.y, p.x);	
	float s = floor((abs(p.x) + abs(p.y)) * 100.0);
	s *= sin(s * 24.0);
	float s2 = fract(sin(s));
	
	float c = step(1.0, tan(a + s + s2 * time * 0.1) * 0.75 );
	
	c *= s2 * 0.5 + 0.1;
	return c;		
}


void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.5;
	p.x *= resolution.x / resolution.y;
			
	float s = sin(time * 10.0) * cos(time * 120.0 + 32.0);
	float ss = s > 0.1 ? s * sin(floor(p.y * 32.0) / 32.0) * 0.4 - 0.2 : 0.0;
	ss *= 0.05;
	
	gl_FragColor = vec4(
		dia(vec2(p.x + ss * floor(p.y * 16.0) / 16.0,  p.y)), 		
		dia(p + 0.002), 
		dia(p),
		1.0
	);

}