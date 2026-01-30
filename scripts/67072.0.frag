// 190820N simple fractal - "The matrix got you, Neo!"

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define t time*0.2
#define MAX_ITERATION 120.
float mandelbrot(vec2 uv)
{
	vec2 z = uv;
	
	vec2 c = vec2(sin(t),cos(t));
	
	float count = 0.0;
	
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = 1./sqrt(10.*z*z) + c;
		if (length(z) > 4.0) break;
		
		count += z.x*z.y;
	}

	return (length(z*count/MAX_ITERATION));
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 8.;
	
	float mb = mandelbrot(uv);
	gl_FragColor = vec4(vec3(mb*10.0), 1.0);

}