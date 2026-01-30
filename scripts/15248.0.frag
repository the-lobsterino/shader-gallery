#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main( void ) {
	gl_FragColor = vec4( sin(time),cos(time),tan(time),0 );

}