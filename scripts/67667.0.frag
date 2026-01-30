// N140920N Mandelbrot with Function of Robert Schütze ... wait a while

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITERATION 120.
vec3 mandelbrot(vec3 c)
{
	vec3 z = c;
	vec3 count = vec3(0.);
	float t = time*0.1;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		// z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);
		
		z = (abs((abs(z)/dot(z,z) - z*cos(t)+c*sin(t))))  ;
		if (length(z) > 2.1) break;
		
		count += z.x;
	}

	vec3 re = ((z*count/MAX_ITERATION));
	// if (re <= 0.0) return 1.;
	return re;
}

void main( void ) {

	// vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	vec2 uv = surfacePosition;
	uv *= 2.;		
	vec3 mb = mandelbrot(vec3(uv,1.));
	gl_FragColor = vec4(vec3(mb), 1.0);

}