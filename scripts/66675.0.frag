// 080820N Mandelbrot-Swirl

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	// if (re <= 0.0) return 1.;
	return re;
}


#define ITERATIONS 10.0
void main() {
	vec2 p = (3.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	p *= 4.0;
	
	float mb = 0.0;
	for(float i = 1.0; i <= ITERATIONS; i+=0.5) {
		p.x += 1.0 / i * sin(time-i * p.y);
		p.y += 1.0 / i * cos(time+i * p.x);
		
		mb += .1 / (1./ITERATIONS + mandelbrot(vec2(p.x, p.y)));
	}

	vec3 col = vec3(mb+sin(p.y+p.x*4.0), mb-cos(p.y+p.x + time*0.9), mb+sin(p.x*3.0));
	
	gl_FragColor = vec4(vec3(mb), 1.0);
}

