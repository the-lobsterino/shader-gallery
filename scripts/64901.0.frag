#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time

void main( void ) {
	

	float c = 100.0;

	vec2 m = mod(gl_FragCoord.xy, c);
	
	vec2 st = step(5.0, m);
	
	vec2 mt = max(st * m/ c, 0.1);
		
	float b = abs(fract(t * 29.0));
	
	gl_FragColor = vec4(mt, b, 1.3);

}