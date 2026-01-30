#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 p = surfacePosition;
	
	float v = p.y / (1.0 + dot(p,p));
	
	vec3 o = vec3(fract(v));
	
	gl_FragColor = vec4( o, 1.0 );

}