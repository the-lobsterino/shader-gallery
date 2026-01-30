// 220820N Mandelbrot fractal at the edge of the corner?

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x*z.x - z.y*z.y, z.x * 2.0 * z.y) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	return re;
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv.y -= 0.5;
	uv *= 2.;		
	float mb = mandelbrot(uv);
	// if (mb >= 0.5 && mb <= 1.0 ) discard;
	gl_FragColor = vec4(vec3(mb), 1.0);

}