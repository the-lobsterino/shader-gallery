precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = ( ( gl_FragCoord.xy / resolution.xy ) * 2. - 1. ) * resolution / resolution.y;

	vec2 z = p;
	for(int i = 0; i < 256; i++) {
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + vec2(0.0, 0.6);
	}
	
	gl_FragColor = vec4(abs(z), 0.0, 1.0);
}