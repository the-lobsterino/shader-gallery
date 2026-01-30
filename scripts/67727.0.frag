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
vec3 mandelbrot(vec3 c)
{
	vec3 z = c;
	vec3 co = vec3(0.0);
	float t = time*0.1;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z= abs(z/dot(z,z) - abs(vec3(sin(mouse.x), sin(mouse.x), sin(mouse.x))));
		co += z;
	}

	return co/MAX_ITERATION; ///MAX_ITERATION;
}

void main( void ) {

	// vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	vec2 uv = surfacePosition;
	uv *= 2.;		
	vec3 mb = mandelbrot(vec3(uv,0.));
	gl_FragColor = vec4(vec3(mb), 1.0);

}
