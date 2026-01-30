#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy) * mouse * 20.0;
	
	float x = position.x;
	float y = position.y;
	if (sin(x * cos(y)) + cos(x * 4.0) + tan(y * 2.0) > 0.0) {
		gl_FragColor = vec4(1, 1, 1, 1);
	} else {
		gl_FragColor = vec4(0, 0, 0, 1);
	}
}