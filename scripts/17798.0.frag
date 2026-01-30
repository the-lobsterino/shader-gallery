/*
    Never write comments after you've learned what a line is doing.
 */

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	// divides the fragment coordinate by resolution, giving a value between 0.0 and 1.0 from left to right, and down to up.
	vec2 position = gl_FragCoord.xy / resolution.xy ;
	position.x += -.3;
	
	position.x *= resolution.x/resolution.y;
	// these things determine where the dot is. It is on a sine trajectory around 0.5, 0.5.
	// http://www.humblesoftware.com/demos/trig_d3
	// - read more on google about trigonometric functions, if it is unclear what is happening.
	float speed = 2.0;
	float x = 0.5 + sin(time * 0.7 * speed) * 0.2;
	float y = 0.5 + cos(time * 0.5 * speed) * 0.2;
	
	// this one is bit arbitrary, but I call it z. It varies the size of the dot.
	float z = cos(time * 0.2 * speed) * 5.0;
	
	// notice the 0.2, 0.5, 0.7, is fibonacci sequence.
	
	// distance between position and the dot, used the in the last line to control blue channel.
	float d = distance(position, vec2(x, y));
	
	// sets the color of the fragment or pixel.
	gl_FragColor = vec4(0.3, position.y*0.5 + 0.25, 1.0-d*(10.0+z), 1.0);
}