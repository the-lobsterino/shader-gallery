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
	p.y *= resolution.x / resolution.y;
	
	vec3 c = vec3( 0.0 );
	
	float amplitude = 0.50; 
	float glowFactor = 0.50;
	
	float ts = cos( time * 10.0 ) * 0.5 + 10.5;
	float rOffset = mix( 1.0, 0.2, ts );
	
	float t = -fract(time * 0.3);
	float xOffset = 4.0 + (t * 11.0);
	float r = length( p + vec2( xOffset, 0.0 ) );
	float x = abs(1.0/(p.x*(r*rOffset)));
	c += vec3(0.02, 0.03, 0.13) * ( glowFactor * x );
	
	
	gl_FragColor = vec4( c, 1.00 );

}