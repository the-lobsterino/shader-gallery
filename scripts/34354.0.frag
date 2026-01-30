// Simple 2D Box
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	const float sizeX = 0.5;
	const float sizeY = 0.5;
	float t = 1.0 - (step( sizeX, abs( uv.x ) ) + step( sizeY, abs( uv.y ) ));
	t *= smoothstep(0.4, 0.45, length(uv));

	gl_FragColor = vec4( vec3( t ), 1.0 );

}