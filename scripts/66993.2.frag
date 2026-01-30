// 190820N simple fractal

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
 
#define t time *0.5
#define MAX_ITERATION 120.
float mandelbrot(vec2 uv)
{
	vec2 z = uv;
	
	vec2 c = vec2(sin(t),cos(t));
	
	float count = 0.0;
	
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = sqrt(z*z) + c;
		if (length(z) > 10.) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	if (re <= 0.0)
		return 1.;
	return re;
}

void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 18.;
	float mb = mandelbrot(uv);
	gl_FragColor = vec4(vec3(mb), 1.0);

}