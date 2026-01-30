//By @PendingChaos

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main( void ) {
	gl_FragColor = vec4(sin(gl_FragCoord.x/2.0+(time*10.0)));
}