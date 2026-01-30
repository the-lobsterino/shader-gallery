// Simple Checkerboard Texture
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define HorizontalTileScale 	16.0
#define VerticalTileScale 	9.0

void main( void ) 
{
	// uv is range from (0.0 to 1.0)
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 110.0;
	gl_FragColor = vec4( (step(0.0, sin(uv.x)) * step(0.0, sin(uv.y))));

}