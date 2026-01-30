// N280820N Klecksographie

#ifdef GL_ES
precision mediump float;
#endif

vec2 uv;
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c, float mx) 
{
	vec2 z = c;
	float count = 0.0;
	float t = time * .8;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);
		if (length(z) > mx) break;
		
		count += 1.0;
			
	}
	float re = (count/MAX_ITERATION);
	return re;
}

void main( void )
{
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	uv *= 5.5;
	//uv.x += cos(time);
	//uv.y += sin(time);
	
	float mb1 = mandelbrot(uv, 3. + 2. * sin(time));		
	float mb2 = mandelbrot(uv/dot(uv,uv), 3. + 2. * sin(time));

	float mb3 = mandelbrot(- uv, 3. + 2. * sin(time));		
	float mb4 = mandelbrot(- uv/dot(uv,uv), 3. + 2. * sin(time));

	gl_FragColor = vec4(vec3(5.*(mb2+mb1 - mb4+mb3)), 1.0);
}