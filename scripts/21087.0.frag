
precision mediump float;

//translated comments 


uniform float time; // time
uniform vec2  resolution; // resolution
//Fragment shader instructs each pixel 
//Note: The conversion of the type on the shader is not performed. float is written as 1.0 instead of 1



void main(void){
	
	
// 4 moving light orbs --------------------------------------
	

     vec2 p = (gl_FragCoord.xy * 2.0 - 2.0) / min (.1, .2);
     float l = 0.1 / length (p);
     gl_FragColor = vec4 (vec3 (l), 1.0);


// 3 light orbs --------------------------------------
	
/*
// Calculation to convert coordinates to -1 to 1 (normalized)
// min () is a function that returns the minimum value from within the range
vec2 p = (gl_FragCoord.xy * 2.0 - r) / min (rx, ry);
// length and put the argument has been normalized origin, I will return the distance from the center of the screen (0,0)
float l = 0.2 / length (p); // normalized by taking the distance from the screen
gl_FragColor = vec4 (abs (vec3 (l) * sin (t)), 1.0);
*/

/*

// 2 --------------------------------------
// abs () is an absolute value us, even negative value are converted to positive
// sin, cos returns 1 to -1
     float r = abs (sin (t * 0.1));
     float g = abs (cos (t * 2.0));
     float b = (r + g) / 2.0;
     gl_FragColor = vec4 (r, g, b, 1.0);
*/

/*
// 1 --------------------------------------
float a = gl_FragCoord.x / 512.0; // gl_FragCoord can get the coordinates of the pixel
     gl_FragColor = vec4 (sin (a * t), sin (a * t), sin (a * t), 1.0); // gl_FragColor is finally drawing color
*/






}