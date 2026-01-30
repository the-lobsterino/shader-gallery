#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec3 c = vec3( 0.0 );

	float x = abs( 1.0 / sin( uv.x ) );
	c += vec3( 0.01, 0.01, 0.05 ) * x;

	gl_FragColor = vec4( c, 1.0 );

}