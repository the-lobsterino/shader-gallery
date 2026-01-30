#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	
	gl_FragColor = vec4(mouse, 0.2, 0.1);
	
}