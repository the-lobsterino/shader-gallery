// Deconstruction of Glowing Line by Brandom Fogerty
// By: Benjamin Shutt
// shuttben at gmail dot com
// benshutt.com
// 
// This is being used for my learning purposes, so I
// cannot guarantee the validity of the comments. Please
// refer to the person below for any questions regarding 
// the code.
//
// Based On:
// 	Glowing Line
// 	By: Brandon Fogerty
// 	bfogerty at gmail dot com
// 	xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;

void main( void ) {
	// Changes the coordinates so that instead of going from zero
	// to the viewport resolution for that axis, it goes from zero to one.
	// i.e.:
	// 	0.0 ≤ x ≤ resolution.x  →  0.0 ≤ x ≤ 2.0
	// 	0.0 ≤ y ≤ resolution.y  →  0.0 ≤ y ≤ 1.0
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	// Zooms out by a factor of 2.0
	uv *= 2.0;
	// Shifts every axis by -1.0
	uv -= 1.0;
	
	// Base color for the effect
	vec3 finalColor = vec3 ( .2, 1., 0. );
	
	finalColor *= abs(0.05 / (sin( uv.x + sin(uv.y)* 0.3 ) * 20.0) );

	gl_FragColor = vec4( finalColor, 1.0 );

}