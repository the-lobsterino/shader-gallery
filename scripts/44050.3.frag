#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	gl_FragColor = vec4(gl_FragCoord.xy * vec2(sin(time), cos(time)), 1, 1);
}