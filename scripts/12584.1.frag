#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = vec4(1,position.x/mouse.x, position.y, 0.0 );
}