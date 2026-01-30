// N270820N LIGHT POINT - COLORIZED

#ifdef GL_ES
precision mediump float;
#endif

vec2 uv;
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c, vec2 z) 
{
	float count = 0.0;
	float t = time * .2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(sqrt(z.x * z.y), sqrt(z.x * z.y)) - c*tan(t);
		if (length(z) > 4.0) break;
		
		count += 1.0;
			
	}
	float re = (count/MAX_ITERATION);
	return re;
}

void main( void )
{
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	uv *= 20.0;
	vec2 z = uv;
	float mb = mandelbrot(uv, z);	
	gl_FragColor = vec4(vec3(z.x*mb, z.y*mb, mb), 1.0);
}