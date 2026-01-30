#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

void main( void ) 
{
	gl_FragColor = vec4(cos(gl_FragCoord.x * time), sin(gl_FragCoord.y * time), 1, 1);
}