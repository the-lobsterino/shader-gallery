// easy diffraction / moire patterns
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iters 3

void main( void )
{
	float accum = 0.0;
	for (int i = 0; i < iters; ++i)
	{
		accum += asin(length(gl_FragCoord.xy / mouse.xy) * float(i) * 4E-3);
		accum += acos(length(gl_FragCoord.xy / mouse.xy) * float(i) * 1E-5 + 3.14159*2.*fract(time*5e-2));
		accum = fract(accum);
	}
	gl_FragColor = vec4( accum,accum,accum, 1.0 );

}