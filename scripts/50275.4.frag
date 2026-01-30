#ifdef GL_ES
precision highp float;
#endif

// Quick shader implementation of "Aliasing Artifacts and Algorithmic Art"
// https://pdfs.semanticscholar.org/f374/fe62813bf2eef076a167c1c41dbc536a3547.pdf

// Version A (centered now)
// Made by David
// (Forked to add tons of comments)

uniform float time;		// This is a variable that increases over time 
uniform vec2 resolution; 	// This is a 2D variable that stores the resolution of the current display 

void main( void ) {

	// Visual parameters (for making things look pretty)
	float initialDensity = 0.01;  	 	// Pattern starting density
	float brightness = 0.5; 		// Maximum pattern brightness 
	float blackLevel = 0.5; 		// Minimum pattern darkness 
	
	// Half the width and half the height gives the position of the center of the screen
	vec2 screenCenter = vec2(0.5,0.5)*resolution; 		
	
	// The current pixel position should be given assuming the screen center is [0,0] 
	vec2 position = gl_FragCoord.xy - screenCenter;		
	
	// Compute squares the current x and y pixel positions and call them x2 and y2
	float x2 = position.x * position.x; 	// x squared
	float y2 = position.y * position.y;	// y squared
		
	// Each pixel value is defined by sin(x2 + y2) 
	// (Multiply the inside of the sin by the current time value to make it zoom in and out)
	float pixelValue = sin(time*initialDensity*(x2 + y2)) * brightness + blackLevel;
	
	// For each pixel, set all its red, green, and blue channels with this technique (making things black and white) 
	gl_FragColor = vec4(pixelValue,pixelValue,pixelValue,1.0);
}