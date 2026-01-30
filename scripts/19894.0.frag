#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( ( gl_FragCoord.xy * 2.0 - resolution ) / max( resolution.x, resolution.y ) );
	float t = time ;

	vec3 a = vec3( 0.1 * sin( t ) * p.y / p.x, p.y * p.x, 0.1 );
	vec3 c = vec3( 10.0 * dot( a * sin( t ), a + t ) );
	c *= sin( a );
	c = 1.0 - sqrt( c );

	gl_FragColor = vec4( c, 1.0 );

}