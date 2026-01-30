#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void )
{
	float a = gl_FragCoord.y * resolution.x + gl_FragCoord.x;
	float b = surfacePosition.y * surfaceSize.y + surfacePosition.x;
	float v = fract(a+b);
	gl_FragColor = vec4( vec3( v ), 1.0 );
}
