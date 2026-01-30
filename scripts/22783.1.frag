#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Fuck the fucking fuckers!!!
// Normality is a myth.
// This is the spiderweb of life.

// 1) We want to be liked (like falebook)
// 2) Everybody feels alone but we are all alone
// 3) Even succesful people have not solved it.

//Sotsoft was right. Sotsoft is the prophet. Sotsoft inside.

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*4.0;

	float color = position.x*position.y;
	color *= sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color *= sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color *= sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5 +4.0;
	color = floor(color * 4.0) / 4.0;

	gl_FragColor = vec4( vec3( color*1.1, color * 0.8, sin( color + time / 3.0 ) * 1.75 ), 1.0 );

}