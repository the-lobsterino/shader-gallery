// N111020N dot fractal 2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITERATION 120.
vec3 mandelbrot(vec2 c)
{
	vec2 z = c;
	vec3 color = vec3(.0);
	float t = time*0.5;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z /= dot(z,z);
		z = vec2(z.x * z.x - z.y * z.y, -2.0 * z.x * z.y);
		z += z*cos(t)+c*sin(t);
		if (length(z) > 2.0) break;
		
		// color += vec3(z,1.);
		color += 1.0; // exp(abs(sin(t)) - vec3(z.x, z.y, length(z)));
	}

	return color/MAX_ITERATION;	
}

void main( void ) {	
	vec2 uv = surfacePosition;
	uv *= 1.0;	
	//uv += vec2(0.0, -1.0);
	vec3 mb = mandelbrot(uv);	
	gl_FragColor = vec4(smoothstep(0.,0.1,mb), 1.0);

}