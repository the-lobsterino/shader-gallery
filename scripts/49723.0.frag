#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define CIRCLE_RADIUS 100.0
#define SQUARE_SIZE vec2(1000.0, 100.0)

void main( void ) {
	vec2 coords = gl_FragCoord.xy;
	
	vec3 circle = vec3(1.3 / (distance(0.5 / CIRCLE_RADIUS * resolution, coords / 100.0)));
	
	vec3 square =   vec3(distance(mouse.x / SQUARE_SIZE.x * resolution.x, coords.x / 100.0)) + 
		      	vec3(distance(mouse.y / SQUARE_SIZE.y * resolution.y, coords.y / 100.0));
	square = 1.0 / square;
	
	gl_FragColor = vec4(square / circle, 1.0);
}