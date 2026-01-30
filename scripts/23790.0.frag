#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define ITERATIONS 128

vec2 expc(vec2 z) {
	float e = exp(z.x);
	
	float c = cos(z.y);
	float s = sin(z.y);
	
	return vec2(e * c,e * s);
}

void main( void ) {


	vec2 z = surfacePosition;
	
	vec2 c = z;
	
	float it = 0.0;
	for (int i = 0; i < ITERATIONS; ++i) {
		z = expc(z) + c;
		
		if (z.x >= 20.0) {
			break;
		}
		it += 1.0;
	}
	
	vec3 color = vec3(0.0);
	
	if (it < float(ITERATIONS)) {
		color.x = sin(it / 7.0);
		color.y = cos(it / 6.0);
		color.z = sin(it / 2.0 + 3.14 / 6.0);
	}

	gl_FragColor = vec4(color,0.0);

}