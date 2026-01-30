/////
///// ATTENTION! PLEASE:
/////     - Change Pixel Size to 1
/////     - Change `ANTI_ALIASING` to your liking
/////
///// HOW TO USE:
/////     - HIDE THE CODE
/////     - Left Click and drag to move around
/////     - Right Click and drag to zoom in and out


// Mandelbrot Set 
// By Sam Belliveau

#ifdef GL_ES
precision highp float;
#endif


// Number of samples per pixel
// Recommended 8 - 32
#define ANTI_ALIASING 16

// Number of Iterations / Bailout
// High Bailout makes smoothing look better
#define ITER 512
#define BAIL_OUT 256.0

// The speed of panning and zooming
#define PAN_SPEED 4.0
#define ZOOM_SPEED 1.0

// Information used by renderer
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;


/////////////////////////////
/// CALCULATION FUNCTIONS ///
/////////////////////////////

float getIter(float cx, float cy);
vec4 getColor(float iter);
vec4 getColor(float cx, float cy);
vec4 getScaledColor(float x, float y);
vec4 getSSAAColor(float x, float y);

void main(void)
{
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	
	gl_FragColor = getSSAAColor(x, y);
}



///////////////////////
/// IMPLEMENTATIONS ///
///////////////////////


//// CONSTANTS ////

// How Quickly the colors cycle
#define COLORS (16)

// Sensitivity of mouse in each direction
#define MX (3.0)
#define MY (2.5)

// What to return if the point never escapes
#define INF_ITER -1.0

// Math Constants
#define PHI (0.61803398875)
#define PI (3.14159265358979323)

#define SMOOTH(x) ((x) + sin(PI * (x)) / PI)


//// FUNCTIONS ////

float getIter(float cx, float cy) {
	float zx = 0.0, zxsqr = 0.0;
	float zy = 0.0, zysqr = 0.0;
	
	for(int i = 0; i <= ITER; i++){
		
		// Fully Optimized Mandelbrot Calculation
		zy *= zx; 
		zy += zy;
		zy += cy;
		zx = zxsqr - zysqr + cx;
		
		zxsqr = zx * zx;
		zysqr = zy * zy;
		
		float dist = zxsqr + zysqr;
		
		if(BAIL_OUT * BAIL_OUT < dist) {
			// Returns a smooth value for the iteration
			float ext =  log2(log2(dist)) - 4.0;
			float iter = float(i) - ext;
			
			return iter;
		} 
		
	}
	
	return INF_ITER;
}

vec4 getColor(float iter) {
	if(iter <= INF_ITER) {
		return vec4(0.0, 0.0, 0.0, 1.0);	
	}
	
	float i = float(COLORS) * float(iter) / float(256);
	
	
	float r = 0.5 + 0.5 * cos(2. * PI * i + 0. * 2. * PI / 3.);
	float g = 0.5 + 0.5 * cos(2. * PI * i + 1. * 2. * PI / 3.);
	float b = 0.5 + 0.5 * cos(2. * PI * i + 2. * 2. * PI / 3.);
	
	return vec4(r, g, b, 1.0);
}

vec4 getColor(float cx, float cy) {
	return getColor(getIter(cx,cy));
}

vec4 getScaledColor(float x, float y) {
	// Get pixel as a vector
	vec2 p = vec2(x, y);
	
	// Translate vector to be centered around zero
	vec2 c = 2.0 * p / resolution - 1.0;
	c.x *= (resolution.x / resolution.y);
	
	// Get Pan and Zoom
	vec2 m = PAN_SPEED * surfacePosition;
	float s = ZOOM_SPEED * length(surfaceSize);
	
	// This creates a magnifying effect
	float dist = dot(c, c);
	dist *= dist;
	dist *= dist * dist;
	dist = 1.0 - min(1.0, dist);
	
	// Translate the Camera Pixels
	c /= dist; 
	c *= s; 
	c += m;
	
	return getColor(c.x, c.y);
}


vec4 getSSAAColor(float x, float y) {
	vec4 sum = vec4(0.0,0.0,0.0,0.0);
	
	// Takes samples at evenly destributed points.
	for(int i = 0; i < ANTI_ALIASING; ++i) {
		// TX takes advantage of phi's irrational nature
		float tx = PHI * float(i); 
		
		// TY is just linearly distributed
		float ty = float(i) / float(ANTI_ALIASING);
	
		// Loop points
		tx -= floor(tx);
		ty -= floor(ty);
		
		// Add the color to the total
		sum += getScaledColor(x + tx, y + ty);
	}
	
	// When summing colors, this is the best way to normalize it.
	return sum / sum[3];
	
}