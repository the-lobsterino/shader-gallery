#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// dashxdr was here 20200627 12:34 AM PST
// Trying to implement Stripe Average Coloring for mandelbrot fractal
// https://en.wikibooks.org/wiki/Fractals/Iterations_in_the_complex_plane/triangle_ineq
// Then see the paper:
// On Smooth Fractal Coloring Techniques master thesis by Jussi Haerkoenen

void main( void ) {
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x);
	v = surfacePosition;
	vec2 center;
	float zoom;
	vec2 m = mouse;
	vec2 z = v;
	float iter = 1.;
	float sum = 0.;
	float M = 65536.;
	#define N 60
	for(int i=1;i<N;++i){
		iter = float(i);
		float angle = atan(z.y, z.x);
		sum+=sin(angle*10.);
		if(length(z)>M) break;
		z = vec2(z.x,z.y) + v;
	}
	sum/=iter;
	float color = sum;
	color = (color - m.x)*(m.y*10.+1.);
	gl_FragColor = vec4(color);
}

