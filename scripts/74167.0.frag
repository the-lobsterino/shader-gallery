precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 p = surfacePosition;
	
	float t = abs(p.y) / dot(p,p);
	
	t = fract(t);

	gl_FragColor = vec4( vec3( t ), 1.0 );

}