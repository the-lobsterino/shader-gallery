#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 mouse;
varying vec2 surfacePosition;

void main( void ) {
	vec2 p = surfacePosition;
	vec2 o = vec2(0,0);
	float c = 0.1/(length(p-o));
	gl_FragColor = vec4(c, c, 0.4 + c, 1);
}