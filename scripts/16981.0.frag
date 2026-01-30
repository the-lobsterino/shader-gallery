#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	gl_FragColor.x = (0.4/time)*gl_FragCoord.x;
	//gl_FragColor.y = (1.0/time)*100.0;
}