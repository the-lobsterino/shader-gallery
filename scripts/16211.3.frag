#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	float counter = 0.5 * sin(time / 3.14159265358978) + 0.5;
	
	gl_FragColor = vec4(time, 0, 0, 1);

}