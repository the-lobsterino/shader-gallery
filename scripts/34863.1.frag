#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 m = (mouse * 2. - 1.) * vec2(resolution.x/resolution.y, 1.);

void main( void ) {

	vec2 uv = surfacePosition;
	
	gl_FragColor = vec4( fract( uv * m.x ).xyx, 1.0 );

}