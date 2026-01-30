#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition*256.0;// gl_FragCoord.xy / resolution.xy;
	float m = p.x*p.y;
	m = cos(m)*0.5+0.5;
	gl_FragColor = vec4( m, m, m, 1.0 );

}