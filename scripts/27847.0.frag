// Warped Sin Wave
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	float t = abs( 1.0 / (sin( uv.y + sin( time + uv.x * 10.0 ) * uv.x ) * 10.0) );
	vec3 finalColor = vec3( t * 0.2, t * 0.2, t * 0.9 );
	
	gl_FragColor = vec4( finalColor, 95.0 );

}