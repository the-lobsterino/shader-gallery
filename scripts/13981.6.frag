#ifdef GL_ES
precision mediump float;
#endif

#define ITERATIONS 50.0
#define BOUND 100.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 sqCpx(vec2 a){
	return vec2( a.x*a.x - a.y*a.y, a.x*a.y + a.y*a.x);
}

float toEsc(vec2 p) {
	vec2 z = vec2(0.0);
	for(float i = 1.0; i < ITERATIONS; i++){
		z = sqCpx(z) + p;
		if(length(z) > BOUND) return i;
	}
	return 0.0;
}
	
void main( void ) {
	// The mandelbrot set.
	// It works!
	vec2 scale = vec2(resolution.x / resolution.y, 1); // converts from square to rectangular
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * scale * 2.0 - scale + (mouse*2.0-vec2(1,1)) * scale * (-1.0);
	float b = toEsc(position);
	if(b == 0.0){
		gl_FragColor = vec4( 0.0 );
	} else {
		
		gl_FragColor = vec4( sin(b)/2.0+1.0, sin(b+1.04)/2.0+1.0, sin(b+2.04)/2.0+1.0, 1.0 );
	}

}