#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.14;
const float TAU = 2.0 * PI;

void main( void ) {
	
	//vec2 m = exp(-(vect2(1,1) * 2.0 - 1.0));
	vec2 s = surfaceSize;
	vec2 p = surfacePosition;
	//float k = abs(time.x*time.y);
	
	p*=(TAU*normalize(p))*(length(p)-time*0.01);
	p = fract(p+time);
	
	gl_FragColor = vec4( vec3( p, 1.0 ), 57. );

}