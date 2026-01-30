#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const float max_iteration = 1000.0;
float iteration =0.0;

float x0 = gl_FragCoord.x;
float y0 = gl_FragCoord.y;
	
float x = 0.0;
float y = 0.0;

void mandelbrot()
{
	if(((x*x + y*y) < 4.0) && (iteration < max_iteration))
	{
		float xtemp = x*x - y*y + x0;
		y = 2.0*x*y + y0;
		x = xtemp;
		iteration++;
		mandelbrot();
	}
}

void main( void ) {

	mandelbrot();
	
	float c = iteration / max_iteration;
	gl_FragColor = vec4(c, c, c, 1.0);

}