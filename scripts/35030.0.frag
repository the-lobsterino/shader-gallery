// By Kourosh Teimouri
// August 2016

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ); // + mouse / 4.0;
	float dist = clamp(length(position - mouse),0.0,1.0);
	
	float seed = dist + time * 0.1;
	float seed2 = dist - time * 0.1;
	
	vec4 col;
	col.r = 0.5 * (1.0 + sin(seed * 20.0));
	col.g = 0.5 * (1.0 + cos(seed2 * 20.0));
	col.b = 0.5 * (1.0 + sin(seed * 20.0 + time * 0.8));
	
	gl_FragColor = col;

}