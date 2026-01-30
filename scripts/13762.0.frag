
//precision mediump float;

//
// Simple function to draw a circle with a shader
//
// By Rebecca Ann Heineman
// becky@burgerbecky.com
//

// Get the mouse coordinates (0 through 1)
//uniform vec2 mouse;
// Get the screen resolution of the browser
//uniform vec2 resolution;
// Radius of the circle to draw
//const float radius = 16.0;
// Color of the circle
//const vec4 circlecolor = vec4(1,0,0,1);

//vec3 background(vec2 pt) 
//{
//	return vec3(abs(sin(pt.x*0.01)), abs(cos(pt.y*0.01)), 0.5);
//}

void main( void ) {
	// Get the distance from the circle center to the pixel to render
	// in screen coordinate offsets
	//vec2 offset = gl_FragCoord.xy-(mouse*resolution);
	//vec2 pt = gl_FragCoord.xy;
	
	// Get the distance squared
	//float distancesquared = dot(offset,offset);
	
	// If the distance squared is less than radius squared, draw inside color
	gl_FragColor = vec4(1.0,1.0,1.0, 1.0);
}
