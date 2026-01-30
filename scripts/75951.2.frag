#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sq(float a) { return a * a; }

void main( void ) {

	const int iters = 300;
	const float i_f = float(iters);
	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	p.y *= (resolution.y / resolution.x);

	p -= vec2(0.5, 0.25);
	
	p *= 2.;
	
	int j;
	vec2 o = vec2(0.2, 0.1);
	for (int i = 0; i < iters; i++) {
		float len = length(o);
		if (len > 4.)
			break;
		
		j = i;
		
		float xs = sq(o.x);
		float ys = sq(o.y);
		
		o = vec2(sq(xs) - 6. * xs * ys + sq(ys), 4. * o.x * xs * o.y - 4. * o.y * ys * o.x ) + p + o;
	}

	float t = float(j) / i_f;
	t *= 3.;
	
	if (t >= 2.8)
		t = 0.;
	
	gl_FragColor = vec4(vec3(t < 1. ? 2. * t : 1., t > 1. ? t - 1. : 0., t > 2. ? t - 2. : 0.), 1.0);

}