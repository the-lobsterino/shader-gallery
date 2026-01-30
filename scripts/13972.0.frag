//Made by PandaMoniumHUN (Krisztian Szabo) - 2014
//Just fooling around with some sine functions
//You can adjust the thickness of the line for experimenting

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define THICKNESS 0.005

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.xy;
	float sineValue = sin(position.x*time);
	float sinTime = sin(time);
	float red = abs(position.y-sineValue) < THICKNESS ? 1.0 : 0.0;
	gl_FragColor = vec4(red, position.x*sinTime, position.y*sinTime, 1.0);
}