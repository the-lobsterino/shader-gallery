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

	vec3 finalColor = vec3 ( 0.3, 0.5, 0.5 );
	
	finalColor *= abs( 1.0 / (sin( uv.y + sin(uv.x+time)* 0.50 ) * 40.0) );
	finalColor *= abs( 1.0 / (sin( uv.x + sin(uv.y+time)* 0.50 ) * 40.0) );
	finalColor *= abs( 1.0 / (sin( uv.y - sin(uv.x+time)* 0.50 ) * 40.0) );
	finalColor *= abs( 1.0 / tan(uv.x-cos(uv.y+time)*2.0)+(sin( uv.x - cos(uv.y+time)* 0.10 ) * 40.0) );
	finalColor *= 1000.0;

	gl_FragColor = vec4( finalColor, 1.0 );

}