precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = 2.0 * (gl_FragCoord.xy/resolution.xy - vec2(0.75, 0.5));
	
	vec2 z = vec2(0.0);
	for(int i = 0; i < 256; i++) {
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + p;
	}
	
	gl_FragColor = vec4(abs(z), 0.0, 1.0);


}