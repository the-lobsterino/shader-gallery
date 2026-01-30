#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int maxIter = 500;

/* Linearly interpolate between the four given colors. */
vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  float x = 1.0 / 3.0;
  if (t < x) return mix(c1, c2, t/x);
  else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
  else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
  return c4;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x *= (resolution.x / resolution.y);
	

	vec2 z = vec2(0.0);
	float dist = 2.;
	int count = maxIter;
	bool escaped = false;
	for(int i=0; i<=maxIter; i++)
	{
		// Standard Mandelbrot set, for z and p complex: z(n+1) = z(n)^2 + p
		z = vec2(z.x*z.x - z.y*z.y, 2.*z.x*z.y) + p;
		
		if(length(z) >= 2.)
		{
			count = i;
			break;
		}
		
		escaped = true;
	}
	
	float t = 1.0 - (float(count) / float(maxIter));
	vec3 fc = vec3(t,t,t);
	
	gl_FragColor = escaped ? vec4(palette(t, vec3(0.22, 0.02, 0.03), vec3(1.1, 0.5, 0.3), vec3(0.0, 1.3, 0.8), vec3(1.0, 0.4, 1.8)), 1.0) : vec4(vec3(2.3, 0.5, 0.8), 1.0);

}