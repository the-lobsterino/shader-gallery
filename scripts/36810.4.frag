// GPU Particle
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ParticleScale 30.0

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	vec3 initColor = vec3( 1.0, 0.4, 1.0);
	vec3 finalColor = vec3( 2.0, 1.4, 1.0);
	
	float a = dot(initColor, finalColor);
	float d = distance(initColor, finalColor);
	float p = ParticleScale * sin(uv.y + a) ;
	
	
	finalColor *= abs( 1.0 / ( length(uv) * p) );
	//finalColor *= abs( 1.0 / ( sin( length(uv) * time) * ParticleScale ) );
	//finalColor *= abs( 1.0 / ( sin( length(uv) ) * ParticleScale ) );
	
	float t =  sin(time) * 0.5 + 0.5;
	finalColor *= mix(initColor, finalColor, t);
	
	gl_FragColor = vec4( finalColor, 1.0 );

}