#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += 0.0 / 10.0 * (position.x - 0.5);

	gl_FragColor = vec4(color * 0.75, 1.0, 1.0, 1.0 );

}