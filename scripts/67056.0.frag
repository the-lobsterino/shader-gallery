// 190820N simple fractal - calculator

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define t time 
#define MAX_ITERATION 120.
float mandelbrot(vec2 uv)
{
	vec2 z = uv;
	
	vec2 c = vec2(sin(t),cos(t));
	
	float count = 0.0;
	
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = z*z + c/z;
		if (length(z) > 4.) break;
		
		count += 1.0;
	}

	return (length(z*count/MAX_ITERATION));
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 5.;
		
	gl_FragColor = vec4(surfacePosition.x*0.5,surfacePosition.y*0.5,0, 1.0);

}