#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) 
{
	vec3 m = vec3(0.8,0.5,0.2) / dot(surfacePosition,surfacePosition)/5.;
	gl_FragColor = vec4(m, .1);
}