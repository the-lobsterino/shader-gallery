#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926535897932384626;
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	float fundamental_freq = 5.0;
	float d = 0.0;
	for(int n = 1; n <= 5; n++) {
		d += 0.1 * (sin(p.x * 2.0 * pi * fundamental_freq * float(n)));
	}
	color = d * 0.5 + 0.5;
	gl_FragColor = vec4( vec3(color), 1.0 );

}