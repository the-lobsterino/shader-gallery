// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	vec3 c = vec3( 0.0 );

	float glowFactor = mix( 0.15, 0.35, 0. );
	
	c += vec3(0.0, 0.02, 0.10) * ( glowFactor * abs( 1.0 / p.x ));
	
	gl_FragColor = vec4( c, 1.0 );

}