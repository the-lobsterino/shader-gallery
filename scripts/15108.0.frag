#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float r = sin(p.x * p.y * 3.14 * 10.0 + time * 2.0) ;
	float g = sin(p.x * p.y * 3.14 * 3.0 + time * 5.0) ;
	float b = sin(p.x * p.y * 3.14 * 9.0 + time * 100.0) ;
	
	gl_FragColor = vec4( r, g, b, 1.0 );

}