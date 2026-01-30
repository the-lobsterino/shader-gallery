//Integer Mandelbrot set implementation (FPGA)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	const int ONE_WIDTH = 128;
	const int MAX_ITER = 16;
	
	vec2 position = ( gl_FragCoord.xy );

	int z_re = 0;
	int z_im = 0;
	
	int z2_re = 0;
	int z2_im = 0;
	int z_re_im = 0;
	
	int c_re = int(position.x) - int(resolution.x)/2;
	int c_im = int(position.y) - int(resolution.y)/2;
	
	bool in_set = false;
	
	for(int i=0; i<MAX_ITER; i++)
	{
		z2_re = (z_re * z_re)/ONE_WIDTH;
		z2_im = (z_im * z_im)/ONE_WIDTH;
		z_re_im = (z_re * z_im)/ONE_WIDTH;
		
		z_re = z2_re - z2_im + c_re;
		z_im = 2 * z_re_im + c_im;
		if( (z2_re + z2_im) > (4*ONE_WIDTH) )
		{
			in_set = true;
			break;
		}
	}
	
	float pixelColour = in_set ? 1.0 : 0.0;
	
	gl_FragColor = vec4( vec3( pixelColour, pixelColour, pixelColour ), 1.0 );

}