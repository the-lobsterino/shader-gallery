#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float d = distance (vec2(-1.5, .5), p);
	
	float r = sin(d * 3.14 * 100.0 + time * 8.0 );
	float g = sin(d * 3.14 * 100.0 + time * 10.0 );
	float b = sin(d * 3.14 * 100.0 + time * 2.0 );
	
	gl_FragColor = vec4 ( r, g, b, 1.0 );

}