#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
float lgbt =sin( u_time *  1.0);	
void main (void) {
	gl_FragColor = vec4( abs(lgbt),0,0,1);
}

