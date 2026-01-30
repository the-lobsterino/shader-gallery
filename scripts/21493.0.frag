#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	gl_FragColor = vec4( gl_FragCoord.x, gl_FragCoord.y, mouse.x - mouse.y, 1);

}