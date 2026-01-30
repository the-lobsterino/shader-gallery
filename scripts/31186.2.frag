#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float checkeredPattern( vec2 p ) {
	float u = 1.0 - floor( mod( p.x, 2.0 ) );
	float v = 1.0 - floor( mod( p.y, 2.0 ) );

	if ( ( u == 1.0 && v < 1.0 ) || ( u < 1.0 && v == 1.0 ) ) {
		return 0.0;
	} else {
		return 1.0;
	}
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min( resolution.x, resolution.y );
	float a = abs( sin(time ) );
	gl_FragColor = vec4( vec3( checkeredPattern(  vec2( sign(p.x) * pow( p.x, a ) , sign(p.y) * pow( p.y, a)  ) * 5.0 ) ), 1.0 );
}