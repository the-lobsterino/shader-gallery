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

	vec3 finalColor = vec3 ( 1.0 * -uv.y, (1.0* uv.y), 1.5 * uv.y );
	
	finalColor *= abs((sin(time))* 10.0 *( 1.0 / (sin( uv.x - sin(uv.y+time)*  sin(uv.x-time) ) * 40.0) ));

	gl_FragColor = vec4( finalColor, 1.0 );

}