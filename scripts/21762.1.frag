// Simple Ripple
// By: Brandon Fogerty
// bfogerty at gmail dot com
// Special Thanks Codea

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	position.x *= (resolution.x / resolution.y);

	float mx = (mouse.x * 2.0 - 1.0) * (resolution.x / resolution.y);
	float my = (mouse.y * 2.0 - 1.0);
	
	// The origin should be wherever the mouse is positioned.
	vec2 origin = vec2( mx, my );
	
	float len = length( position - origin );
	
	float freq = 200.0;
	vec2 v2 = ( (position-origin) / len ) * freq * sin( time*4.0 - len*15.0 )*0.05;
	
	gl_FragColor = vec4( v2.x, v2.y, 0.0, 1.0 );

}