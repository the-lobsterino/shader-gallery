#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2 (0.5, 0.5);
	float angle = 2.0 * mouse.x;
	float flip_at = 0.25 * (mouse.y - 0.5);
	
	float c = cos(angle);
	float s = sin(angle);
	for (int i = 0; i < 16; i++) {
		position = vec2 (c * position.x - s * position.y, s * position.x + c * position . y);
		position = vec2 (smoothstep (flip_at, flip_at + 1.0, position.x) - flip_at,
				2.0 * length(position) - 1.0);
	}



	gl_FragColor = vec4( 1.0 - smoothstep (0.0, 0.1, position.x), 0.0, smoothstep (0.15, 0.2, position.y), 1.0);

}