// 290820N Mandelbrot Landscape with sky and ocean and sunset... thing :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c, float delta)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*sin(t+delta)+c*sin(t+delta);
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	// if (re <= 0.0) return 1.;
	return re;
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 4.;		
	float mb1 = mandelbrot(vec2(uv.x*1./4., uv.y*2.0), 0.1 * 3.1415);
	float mb2 = mandelbrot(vec2(uv.x*1./8., uv.y*1.0), mb1 + 0.2 * 3.1415);
	float mb3 = mandelbrot(vec2(uv.x*1./16., uv.y*.5), mb2 + 0.4 * 3.1415);
	
	gl_FragColor = vec4(vec3(mb1, mb2, mb3), 1.0);

}