#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

vec3 f(float x)
{
	return fract(vec3(
		x * 2.0, x * .0, x
	));
}

void main( void ) {

	vec2 p = surfacePosition * 32.;
	p.x = p.x/2.;	
	float d = dot( p*6.9, p*.02 );
	
	gl_FragColor = vec4( f( d + time ), 1.0 );
}