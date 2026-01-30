#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float a = 2.0*sin(p.x * 3.14 * 10.0 + 3.14);
	float b = 5.0*sin(p.y * 3.14 * 50.0 + 3.14);
	float c = sin((a + b) * 3.14 + time) ;

	gl_FragColor = vec4( c, c, c, 1.0 );

}