// Relationship between Mandelbrot and Julia sets

#ifdef GL_ES
precision mediump float;
#endif

#define MAX_ITER 100

// Time (in seconds from when this GLSL sandbox began)
uniform float time;

// Mouse coordinates
// Origin is at bottom left with +x axis towards the right
// and +y axis upwards within the interval [0.0, 1.0]
uniform vec2 mouse;

// The resolution (in pixels)
uniform vec2 resolution;


float julia(vec2 z, vec2 c) {
	float iter = 0.;
	
	for(int i = 0; i < MAX_ITER; i ++) {
		z = vec2(z.x * z.x - z.y * z.y + c.x, 2. * z.x * z.y + c.y);
		
		if(dot(z, z) >= 4.) break;
		
		iter ++;
	}
	
	return iter/float(MAX_ITER);
}

float mandelbrot(vec2 z, vec2 c) {
	float iter = 0.;
	for(int i = 0; i < MAX_ITER; i ++) {
		z = vec2(z.x * z.x - z.y * z.y + c.x, 2. * z.x * z.y + c.y);
		
		if(dot(z, z) >= 4.) break;
		
		iter ++;
	}
	
	return iter/float(MAX_ITER);
}

void main( void ) {
	// Aspect ratio correction
	float a = resolution.x/resolution.y;
	
	// The original uv coordinates
	vec2 uv_org = gl_FragCoord.xy/resolution.xy;
	
	// Julia set coordinates
	vec2 uv_julia = uv_org;
	
	// Mandelbrot set coordinates
	vec2 uv_mandelbrot = uv_org;
	
	uv_julia -= vec2(0.25, 0.5);
	uv_julia.x *= a;
	uv_julia *= 4.;
	
	uv_mandelbrot -= vec2(0.75, 4.);
	uv_mandelbrot.x *= a;
	uv_mandelbrot *= 4.;
	
	vec2 c = mouse;
	c -= vec2(0.25, 0.5);
	c.x *= a;
	c *= 4.;
	
	float iter = 0.;
	
	float shade = julia(uv_julia, c);

	shade += mandelbrot(vec2(0., 0.), uv_mandelbrot);
	
	vec3 col = vec3(shade);
	
	vec2 uv3 = vec2(uv_mandelbrot.x/4. + 0.5, uv_mandelbrot.y/4. + 0.5);
	
	if(dot(uv3 - vec2(mouse.x*a, mouse.y), uv3 - vec2(mouse.x*a, mouse.y)) < 0.0001) {
		col = vec3(1., 0., 0.);
	}
	
	gl_FragColor = vec4(col, 1.);
}