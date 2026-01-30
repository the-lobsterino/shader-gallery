#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// ported my shitty fractals to glsl lol https://ish.works/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int HARD_MAX_ITER = 500;

int is_mandelbrot(float cr, float ci, int softmax) {
	// these are definitely not part of the set
	if (cr * cr + ci * ci > 4.) {
		return 0;
	}

	// compute some iterations of z*z + c
	// this uses a nice clever trick i copied from https://randomascii.wordpress.com/2011/08/13/faster-fractals-through-algebra/
	// they work because 
	// (a + ib)^2 = a*a + a*ib + ib*ib + ib*a = a*a + ib*ib + a*ib + ib*a = 
	//            = (a*a - b*b) + i(2ab)
	// and
	// |a + ib|^2 = sqrt(a*a + b*b)^2 = a*a + b*b
	float zr = 0.;
	float zi = 0.;

	float zsqr = 0.;
	float zsqi = 0.;

	for (int i = 0; i < HARD_MAX_ITER; i += 1) {
		zr = zsqr + cr;
		zi = zsqi + ci;

		zsqr = zr * zr - zi * zi;
		zsqi = 2. * zr * zi;

		if (zr * zr + zi * zi > 4. || i >= softmax) {
			return i + 1;
		}
	}

	return HARD_MAX_ITER + 1;
}

void main( void ) {
	float viewScale = 500. + pow(5., mod(time, 10.0));
	vec2 viewCenter = vec2(.37047);/// - mouse.xy / 5.;
	
	vec2 minCoords = viewCenter - (resolution / (2. * viewScale));
	
	vec2 pos = minCoords + (gl_FragCoord.xy / viewScale);
	
	int softmax = 100 + int(viewScale / 100.0);
	
	if (softmax > HARD_MAX_ITER) {
		softmax = HARD_MAX_ITER;
	}
	
	int mb = is_mandelbrot(pos.x, pos.y, softmax);
	
	if (mb > softmax) {
		gl_FragColor = vec4(vec3(0.), 1.);
	} else {
		gl_FragColor = vec4(vec3(sqrt(float(mb)/(float(softmax)+1.))), 1.);
	}

}