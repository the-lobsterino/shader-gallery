#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;

void main( void ) {
	gl_FragColor = vec4(vec3((mouse).y,0.0,abs(sin(time * 1.0))), 1.0);
}