#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float x = 0.0;
	
	x = distance(p, vec2(0.5, 0.5));

	gl_FragColor = vec4(x, x, x, 1);
}