#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float d = distance (vec2(0.5, 0.5), p);
	
	float r = sin(d * 3.14 * 2.0 + time * 60.0 );
	float g = sin(d * 3.14 * 0.0 );
	float b = sin(d * 3.14 * 2.0 + time * 70.0 );
	
	gl_FragColor = vec4 ( r, g, b, 1.0 );

}