#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITERATION 120
float mandelbrot(vec2 c, out vec2 z)
{
	
	float count = 0.0;
	for (int i = 0; i < MAX_ITERATION; i++)
	{
		z = vec2(-1.*(tan(time))*z.x * z.x - z.y * z.y, 0.5 * z.x * z.y) +  c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}

void main( void ) {

	vec2 po = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 15.0;

	
	vec2 z = po;
	float mb1 = mandelbrot(po,  z);
	
	z = -z*po;
	float mb2 = mandelbrot(po,  z);
	
	z = -z*po;
	float mb3 = mandelbrot(po,  z);

	z = -z*po;
	float mb4 = mandelbrot(po,  z);

	z = -z*po;
	float mb5 = mandelbrot(po,  z);

	z = -z*po;
	float mb6 = mandelbrot(po,  z);

	
	gl_FragColor = vec4(vec3(0.1 + mb1-mb2 * 2.,0.1 + mb3-mb4 * 2.,0.1 + mb5-mb6 * 2.), 1.0);

}