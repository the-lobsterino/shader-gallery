#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float a = cos(time);
	
	gl_FragColor = vec4(1, a, 0, 1);
}