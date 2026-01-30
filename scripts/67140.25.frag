#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D s;

#define PILTROFICATION .45
#define MUSCOFICATION_COEFFICIENT 0.265
#define EINSTEIN_MUSK_REFRACTION_INDEX 0.125
#define INSIPATION_POWER .35
#define HORKIFICATION_SPEED .75
#define BANACH_TRUMP_PRIME_MANIFOLD .1

#define MAX_ITERATION 150.
float mandelbrot(vec2 c) {
	vec2 z = c;
	float count = 0.0;
	float t = time * 0.25;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c - 0.125 * z*cos(t)+c*sin(t) + z*sin(t)-c*cos(t);
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	if (re <= 0.0)
		return 1.;
	return re;
}

  
void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
	float mb = mandelbrot(p) * 2.5;
	vec2 ps = gl_FragCoord.xy / resolution.xy;
    	float r = max(.2, pow(pow(p.x, 20.0) + pow(p.y, 10.0), 1./8.));
	vec4 x = (texture2D(s, mb + ps + r / 1.5) + texture2D(s, mb + ps - r / 1.5)) * .75;
   	vec2 uv = vec2(1.0 / r + .35 * time, atan(p.y, p.x));
    	float f = cos(2. * uv.x) * cos(3. * uv.y);
    	vec3 col = BANACH_TRUMP_PRIME_MANIFOLD + .25 * tan(3.1416 * f + vec3(-.25, .0, .25) + PILTROFICATION * sin(time * .35));
	x += sin(time * HORKIFICATION_SPEED) * MUSCOFICATION_COEFFICIENT - EINSTEIN_MUSK_REFRACTION_INDEX;
    	gl_FragColor = vec4(col * r, 1.0) + x * INSIPATION_POWER;
}