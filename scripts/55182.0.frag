#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.5;

	color = sin(position.x * 0.01 * time) + 1.0;

	gl_FragColor = vec4( vec3( color, color * 0.4, color), 0.1 );

}