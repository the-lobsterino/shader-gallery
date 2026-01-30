#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	int x = int((position.x + time / 10.0) * resolution.x) / 50;
	int y = int((position.y + time / 5.0) * resolution.y) / 50;
	int xy = x + y;
	if (xy - xy / 2 * 2 == 0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 );
	} else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5 );
	}
}