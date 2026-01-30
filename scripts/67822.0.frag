// N180920N

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
	float t = time*0.1;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);
		z = abs(z/dot(z,z) - abs(vec2(0.5*sin(t*2.0),1.*sin(t))));
		// if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	if (re <= 0.0)
		return 1.;
	return re;
}

void main( void ) {

	// vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	vec2 uv = surfacePosition;
	uv *= 18.;		
	float mb = mandelbrot(uv);
	gl_FragColor = vec4(vec3(mb), 1);

}
