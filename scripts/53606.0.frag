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
	vec2 p = vec2(gl_FragCoord);
	gl_FragColor = vec4(vec3(1.3,2.2,0.5) / dot(surfacePosition, surfacePosition) / 100.0,50.0);
	
}