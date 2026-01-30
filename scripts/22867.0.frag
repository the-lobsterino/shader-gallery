#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5)) * 2.0;

	position.x += 0.1 * sin(position.y * (3.0 + cos(time)));
	
	float xSize = abs(position.x / position.y);
	float tanAngle = tan(mix(PI/2.0, PI/4.0, abs(position.y)));
	
	float ground = step(0.0, -position.y);
	float road = step(xSize, 1.0) * ground;
	float side = step(0.8, xSize) * road;
	float center = step(xSize, 0.05);
	
	float brightness = step(0.5, road) * 0.5;
	
	float stripe = max(0.0, sign(mod(tanAngle*1.0 + time*4.0, 2.0) - 1.0) * road);
	
	brightness += 0.5 * (stripe * (side + 1.0 * center));
	
	// sides = red
	float red = side;
	brightness -= red*0.25; // reduce overall brightness just to make the sides more pleasing
	
	// ground = green
	float green = (1.0 - road) * ground * 0.75 + (1.0 - ground) * 0.5;
	
	// sky = blue
	float blue = (1.0 - ground);
	brightness += blue * (1.0 - position.y) * 0.5;

	gl_FragColor = vec4( brightness + red, brightness + green, brightness + blue, 1.0 );

}