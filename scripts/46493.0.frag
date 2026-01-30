#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse.x / 4.0;

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	r = abs(sin(time * pos.x));
	
	
	gl_FragColor = vec4(  r, g, b, 1.0 );

}