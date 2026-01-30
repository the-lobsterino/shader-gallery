
#ifdef GL_ES
precision highp float;
#endif


#extension GL_OES_standard_derivatives : enable 

uniform float time;
uniform vec2 resolution;

void main( void )
{
	gl_FragColor = vec4( .0 );
}
