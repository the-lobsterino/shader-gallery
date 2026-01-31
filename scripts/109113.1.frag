#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform sampler2D texture;

void main() {

	gl_FragColor = vec4(abs(sin(time)),0.5,abs(sin(time*1.0)),1.0);

}