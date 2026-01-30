#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

// How many iterations should be tested to see if n -> Infinity?
#define NUM_ITERS 128
#define CONSTANT vec2(0.301, 0.575)

#define MODE_FIXED 0
#define MODE_MOUSE 1
#define MODE_MANDELBROT 2

// Change this to use the different modes
#define MODE MODE_MOUSE

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// A summary of Filled Julia Sets, for those who don't already know.

// A filled julia set is the collection of points that are bounded when
// some function f(z) = z^2+c. The result of this function is passed into
// f(z), which again is passed into f(z). This goes on forever in the
// mathematical world, but computers aren't so good at processing an
// infinite amount of data in a finite time. `z` is in the set if
// the repetition does not spiral out to infinity. Another important
// thing to note is that different values of `c` will produce different
// julia sets. We will gt back to this later...

// Now, the number you start with is every *complex* number, which is
// often represented in 2D space. The "real" component is the x-axis,
// and the "imaginary" component is the y-axis.

// To generate the image, you get all of the positions on the screen and
// figure out if f(z) is bounded. If it is, then that pixel will be white
// because it will have completed all its iterations. The more iterations
// it takes for a z value to escape to infinity, the brighter the pixel
// will be. This means dark pixels escaped very fast,and white pixels
// did not escape in our iteration limit at all.

// Back to the `c` constant... If you were moving our mouse around the
// screen, you might have noticed two types of sets; some have a lot of
// white, while others have very little. You also may have noticed that
// in the ones with a lot of white, all the white pixels were *connected*,
// and all the pixels in the dark ones were *disconnected*. So how can
// you tell if a julia set will be connected or not?
// Meet the Mandelbrot set.

// The mandelbrot set is very similar to the julia sets in that you
// repeatedly take f(z) on the last value; the difference being that
// instead of plugging in every complex number for z, you plug in
// every complex number for *c* and always start at z=0. The Mandelbrot
// set is linked to filled julia sets because for every point in the
// Mandelbrot set, there is a *connected* Julia set. And for every point
// outside, a *disconnected* one.

// I hope someone leared something from this!

// NOTE: You can pan the graphic by left-clicking and dragging,
// and you can zoom by right-clicking and dragging. Dragging to the top
// left will zoom out, and dragging to the bottom right will zoom in to
// the center of the screen.

void main(void) {
	vec2 p = surfacePosition;
	int j = 0;
	vec2 z = p;
	
	for(int i = 0; i < NUM_ITERS; i++){
		j++;
		if(length(z) > 3.) break;
		
		#if MODE == MODE_FIXED
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + CONSTANT;
		#endif
		
		#if MODE == MODE_MOUSE
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + mouse;
		#endif
		
		#if MODE == MODE_MANDELBROT
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + p;
		#endif
	}
	float t = float(j) / float(NUM_ITERS);
	gl_FragColor = vec4(vec3(t), 1);
}