#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	gl_FragColor = vec4(1.0 - position.x, 0.0, 0.0, 1.0);
}