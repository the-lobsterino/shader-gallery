#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	float r = mod(time*30.,1.) < .5 ? 1. : 0.;
	float g = mod(time*30.,2.) < 1. ? 1. : 0.;
	float b = mod(time*30.,4.) < 2. ? 1. : 0.;
	gl_FragColor = vec4(r,g,b,1.0);
	
}