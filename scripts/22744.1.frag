#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

vec3 red = vec3(1, 0, 0);

void main( void ) {

	// this code is set up and is common
	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	vec2 mousepos = mouse;
	mousepos.y = mouse.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	// here w render the cube
	if(position.x > 0.45 && position.x < 0.55 && position.y > 0.45 && position.y < 0.55) color += red;
	
	// here we just set the color, its common
	gl_FragColor = vec4(color, 1.0 );

}