// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
		
	float glowFactor = .75 + sin(time) * 0.25;
	vec3 color = vec3(sin(time) * 0.03 + 0.1, 0.06, sin(time) * 0.03 + 0.09);
	
	vec3 glow = color * ( glowFactor * abs( 0.008 / (sin( p.x ) * sin( p.x )) ));
	
	gl_FragColor = vec4( glow, 1.0 );

}