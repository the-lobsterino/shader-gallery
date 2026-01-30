#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy * 2.0 ) - vec2( 1.0 ); // normalise and translate to center
	position.x *= resolution.x / resolution.y; // scale x to make the axes proportional (y range is [-1, 1], x is depens on how wide the window is
	
	
	float d = distance( vec2( 0.0 ), position );
	//float s = 0.15;
	//d = mod( d, s );
	//d = step( s * 0.5, d); // step returns 0 if second argument is less than first, 1 otherwise

	
	float curl = 0.4;
	float m = 10.0, mm = 1.0; // twiddle these
	
	float a = atan( position.y, position.x ) / PI / 20000.0 + 1.5; // normalised angle
	a+= d * curl /* comment line from here to go for the true whirly effect */- time * -100.525;
	a = step( mm * 0.1, mod( a * m, mm ) );
	
	float b = atan( position.y, position.x ) / PI / 2.0 + 0.5; // normalised angle
	b-= d * curl - time * 0.425;
	b = step( mm * 0.5, mod( b * m, mm ) );
	
	
	
	float c = min( a, b );
	gl_FragColor = vec4( vec3( c * 1.0, c * 1.0, c ), 1.0 ); // grayscale, full alph

}