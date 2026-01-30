// N170920N 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITERATION 20.
float mandelbrot(vec2 c)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = atan(vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y)) + z *cos(t)-c*sin(t);
		// if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	return re;
}

void main( void ) {

	vec2 uv = surfacePosition;
	uv *= 4.;		
	float mb0 = mandelbrot(uv + vec2(0.,0.));
	// float mb1 = mandelbrot(uv * vec2(mb0));
	// float mb2 = mandelbrot(uv * vec2(mb1));
	
	
	gl_FragColor = vec4(vec3(mb0), 1.0);

}