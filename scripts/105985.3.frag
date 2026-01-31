#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;       // Time in seconds since load

void main() {
	gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
}