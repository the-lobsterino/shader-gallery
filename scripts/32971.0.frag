// GPU Particle
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ParticleScale 19.0

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec3 finalColor = vec3( 2.0, 1.4, 1.0 );
	
	finalColor *= abs( 1.0 / ( sin( length(uv) ) * ParticleScale ) );
	
	gl_FragColor = vec4( finalColor, 1.0 );

}