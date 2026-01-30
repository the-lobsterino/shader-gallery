#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

void main( void )
{
	float Red = 0.5;
	float Green = 0.8;
	float Blue = 1.0;

	gl_FragColor = vec4( Red, Green, Blue, 1.0 );
}
