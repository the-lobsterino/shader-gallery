#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define r surfacePosition

void main( void ) {
	gl_FragColor = vec4(length(r));
	gl_FragColor = pow(gl_FragColor, vec4(r.y/sin(time)));
}