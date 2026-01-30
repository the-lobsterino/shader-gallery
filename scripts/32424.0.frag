// Japanese Flag (In honor of my Wife's country)  :D
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

// Japan? You ok? You seem a little tense...

#ifdef GL_ES
precision mediump float;1.5
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec3 finalColor = step(length( uv ), 0.5+sin(time*40.)*0.01) * vec3( 1.0, 0.0, 0.0 );
	finalColor += step( dot( finalColor, finalColor ), 0.1 );

	gl_FragColor = vec4( finalColor, 1.0 );
}