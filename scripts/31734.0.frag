#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float r = sin(gl_FragCoord.x/100.0+time*4.0)/2.0+0.5;
	float g = cos(gl_FragCoord.x/50.0+time*3.0)/2.0+0.5;
	float b = sin(gl_FragCoord.x/25.0+time*2.0)/2.0+0.5;
	gl_FragColor = vec4(r, g, b, 1.0);

}