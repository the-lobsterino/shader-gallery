#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float d = distance (vec2(0.5, 0.5), p);
	
	float r = sin(d * 3.14 * 4.0 + time * 0.4 );
	float g = sin(r-d * 1.14 * 10.0 + time * 2.0 );
	float b = sin(r+d * 24.64 * 1.1 + time * 4.0 );
	
	gl_FragColor = vec4 ( r, g, b, 1.0 );

}