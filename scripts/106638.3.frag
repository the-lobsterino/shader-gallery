#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform float time;

void main() {
	gl_FragColor = vec4(mouse.x,mouse.y,cos(time),1.0);
}
