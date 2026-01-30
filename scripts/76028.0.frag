#extension GL_OES_standard_derivatives : disable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 6.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 678989879090.987755 ) * 34569.909 ) + cos( position.y * cos( time / 20.0 ) * 10.0 );
	color += sin( position.y * sin( time / 1234567890.1234567890 ) * 3.14159265893979 ) + cos( position.x * sin( time / 30.0 ) * 40.0 );
	color += sin( position.x * sin( time / 12345678987654321.1234567890987654321 ) * 10.0 ) + sin( position.y * sin( time / 60.0 ) * 80.0 );
	color *= sin( time / 666.666 ) * 3465476987684645357792515435.457875856493568453;

	gl_FragColor = vec4( vec3( color, color * 999.666, sin( color + time / 99.0 ) * 99.78 ), 9.0 );

}