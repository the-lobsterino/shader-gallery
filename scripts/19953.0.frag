#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );


	float c = 0.0;
	float d = distance (p, vec2(0.5, 0.5));
	float a = sin( p.x * 3.14 * 5.0 + time + 10.0 )
	float b = sin( p.y * 3.14 * 5.0 );
	
	c = a + b;
	
	