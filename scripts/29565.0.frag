#ifdef GL_ES
precision mediump float;
#endif

void main(void) {
	vec3 col = vec3(0.5, 0.2, 0.5);
	
	gl_FragColor = vec4(col, 1.0);
}