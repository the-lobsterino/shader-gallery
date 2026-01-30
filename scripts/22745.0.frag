#ifdef GL_ES
precision mediump float;
#endif

// Hay, Tereza..


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

vec3 red = vec3(1, 0, 0);

void main( void ) {

	// this code is set up and is common
	position = ( gl_FragCoord.xy / resolution.xy );
	position -= vec2(.5);
	position.y = position.y * resolution.y/resolution.x;
	
	// here we define the rotation angle, it's common
	// a common note: atan can be usefull to get a vector rotation relative to a given axis (here the z axis)
	float rot = -atan(mouse.y-.5, mouse.x-.5);
	
	// here we rotate, it's common
	position = vec2(position.x*cos(rot)-position.y*sin(rot), position.y*cos(rot)+position.x*sin(rot));
	
	vec2 mousepos = mouse;
	mousepos.y = mouse.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	// here w render the cube
	if(abs(position.x) < 0.1 && abs(position.y) < 0.1) color += red;
	
	// here we just set the color, its common
	gl_FragColor = vec4(color, 1.0 );

}