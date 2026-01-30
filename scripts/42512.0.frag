// Playing around with Lissajous curves.
#ifdef GL_ES
precision mediump float;
#endif

//what if you want to draw 22 million dots?

//input variables
uniform float time;
uniform vec2 resolution;

//number of blue dots
const int num = 5;

void main( void ) {
    // this variable will be the final blue value of this pixel (can be between 0 and 1)
    float sum = 0.0;
    
    //the size of a single blue dot. The bigger it is, the larger the area of its light, of course.
    float size = 1.0;

    // the middle of the screen	
    vec2 middle = resolution/2.0;
	
    // the coordinates of the exact pixel we are drawing now,
    // this changes every time this program is called since it's called once for every pixel.
    vec2 coord = gl_FragCoord.xy;
	
	
	
    /*for loop, this does one iteration for every blue dot that we want to draw.
	
    what it does is: 
    
	First, calculate the distance between our pixel and the center of each dot.
    	Second, it divides the size of the dot by the distance from the center of the dot, to get how "blue" 
	this pixel has to be. The smaller the distance, and the bigger the size of the dot,
   	the more blue our pixel will be.

    So with a size of one and a distance of 2, the pixel will be 0.5 blue.
    
    It does this once for every dot, this way it adds the brightness (blue value) of each dot in the position of our pixel to the total blue value of our pixel (sum).
    So for example:
	If this pixel is at distance 2 from one dot (brightness 1/2 = 0.5) and distance 4 from another (brightness 1/4 = 0.25) the total blue value of the pixel is 0.75.
		
    */
    for (int i = 0; i < num; ++i) {
	// calculate position of this dot. It starts from the middle of the screen and then adds an offset to the y coordinates, based on "i";
	// X coordinates are untouched. So every dot has the same (center) X coordinates, and different Y coordinates.
        vec2 position = middle;
        position.y += float(i*100);
	
	// get distance of this pixel to this blue dot, based on our pixel's coordinates and the dot's  
	float distance_to_dot = length(coord - position);
	
	// get the brightness of this dot in the position of our pixel, then add it to our total blue
	sum += size / distance_to_dot;
	
    }
    // output this pixel's final color.
    gl_FragColor = vec4(0, 0, sum, 1);
}