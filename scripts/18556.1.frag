// ShadowCode
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.14159;
void main( void ) {
	float Red = 0.0;
	float Green = 0.0;
	float Blue = 0.0;
	float change = sin(time);
	Red = (gl_FragCoord.y  / resolution.x + (change*-0.5))* 01.0;
	Blue = (gl_FragCoord.x / resolution.y + (change*0.2) )* 0.5;
	Green = (gl_FragCoord.x / resolution.x + (change*0.7) + cos(time)) * 0.2;
	
	gl_FragColor = vec4(Red,Green,Blue,0.0 );
}