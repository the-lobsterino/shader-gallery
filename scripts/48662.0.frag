#ifdef GL_ES
precision highp float;
#endif

#define ITERATIONS 100.0
#define BOUND 100.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 mltCpx(vec2 a, vec2 b){
	return vec2( a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

float toEsc(vec2 p) {
	vec2 z = vec2(0.0);
	for(float i = 1.0; i < ITERATIONS; i++){
		vec2 tmp = mltCpx(z, z);
		tmp = mltCpx(tmp, z);
		tmp = mltCpx(tmp, z);
		tmp = mltCpx(tmp, z);
		tmp = mltCpx(tmp, z);
		z = tmp + p;
		if(length(z) > BOUND) return i;
	}
	return 0.0;
}
	
void main( void ) {
	// The mandelbrot set.
	// It works!
	vec2 scale = 1.15 * vec2(resolution.x / resolution.y, 1); // converts from square to rectangular
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * scale * 2.0 - scale + (vec2(0.5)*2.0-vec2(1,1)) * scale * (-1.0);
	float b = toEsc(position);
	if(b == 0.0){
		//check out your video card memory!
	} else {
		gl_FragColor = vec4( sin(b)/2.0+1.0, sin(b+1.04)/2.0+1.0, sin(b+2.04)/2.0+1.0, 1.0 );
	}

}