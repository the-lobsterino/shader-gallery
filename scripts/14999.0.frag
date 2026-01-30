#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float r = sin(p.x * p.y * 3.14 * 50.0 + time );
	float g = sin(p.x * p.y * 3.14 * 20.0 + time );
	float b = sin(p.x * p.y * 3.14 * 30.0 + time );
	
	gl_FragColor = vec4(r, g, b, 1.0 );

}