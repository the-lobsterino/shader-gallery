// 150720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 square(vec2 z)
{
	float x = z.x, y = z.y;
	float m = 5.*sin(time*0.1);
	return vec2(mod(x * x - y * y, m), (2.0 * x * y));
}

vec3 mandelbrot(vec2 c)
{
	int MAX_ITERATION = 120;
	
	vec2 z = c;
	float count = 0.0;
	
	for (int i = 0; i < 120; i++)
	{
		z = square(z) + c;
		if (length(z) > 22.0) break;
		
		count += 1.0;
	}
	
	return vec3(count / float(MAX_ITERATION));
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;

	gl_FragColor = vec4(mandelbrot(position), 1.0);

}