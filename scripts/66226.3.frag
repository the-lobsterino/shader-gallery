// 220720N MA-MA-MA-MA-MANDELBROT SET :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITERATION 100
float mandelbrot(vec2 c, out vec2 z)
{
	
	float count = 0.0;
	for (int i = 0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}

void main( void ) {

	vec2 po = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;

	
	vec2 z = po;
	float mb =  mandelbrot(po,  z);
	
	float f = -1.0;
	for (float i=0.; i<=1.;i+=.1) {
		
		
		z.x = z.x*sin(time*0.1);
		z.y = z.y*cos(time*0.1);
		mb += f*mandelbrot(po, z);
		f *= -1.0;

	}
	
	gl_FragColor = vec4(vec3(mb), 1.0);

}