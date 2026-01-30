// Glowing Line
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main( void ) {



	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 finalColor = vec3 ( sin(time * 10.) * 10.0, sin(time) * 5.0, 1.0 );
	
	finalColor *= abs( 1.0 / (sin( uv.x + tan(uv.y+time)* 0.10 ) * 50.0) );
	gl_FragColor = vec4( finalColor, 1.0 * mouse );
}