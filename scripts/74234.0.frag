precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define A fract(time+time/dot(surfacePosition,surfacePosition))
#define B fract(time+time*dot(surfacePosition,surfacePosition))

float f(float x)
{
	return 2.0 * x - x*x;
}

void main( void ) {
	
	vec2 p = surfacePosition+f(time);
	
	float t = abs(p.y+p.x) / dot(p,p);
	
	t = fract(t+fract(A+B));

	gl_FragColor = vec4( vec3( t ), 1.0 *time);

}