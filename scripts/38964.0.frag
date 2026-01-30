// Glowing Line
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 finalColor = vec3 ( 1.0, 0.3, 0.5 );
}