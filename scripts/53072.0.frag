#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main() {
	
	
	gl_FragColor = vec4(1.0) * time *sin(.5);
}
