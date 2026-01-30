#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy  * 2.0 -  resolution ) / min(resolution.x, resolution.y);

	gl_FragColor = vec4(position, 0.0, 1.0);

}