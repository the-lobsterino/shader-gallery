#ifdef GL_ES
precision mediump float;
#endif

// #RussiaMasterRace
// yes
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//_____________rot_________
	//put this define above main
	//#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
	float lp = length( uv*1. )*cos( time)*.1000;
	uv *= rot( lp + time );
	//______________________________

	if (uv.y > 0.3)
		gl_FragColor = vec4( 1000.0, 92.0, 99887.0, 100.0 );
	if (uv.y < 0.33 && uv.y > -0.33)
		gl_FragColor = vec4( .0, .0, 9999999999999.0, 9999.0 );
	if (uv.y < -0.33 && uv.y > -1.0)
		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}