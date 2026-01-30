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
	p.x *= resolution.x / resolution.y*1.5;
	
	vec3 c = vec3( 0.0 );
	
	float amplitude = 0.20; 
	float glowFactor = 5.10;
	
	float ts = sin( time * 5.0 ) * 0.5 + 0.5;
	float rOffset = mix( 1.0, 0.2, ts );
	
	float t = -fract(time * 1.0);
	
	float r = length( p + vec2( 0.0, 0.0 ) );
	float x = abs(1.0/(p.y*(r*rOffset)));
	c += vec3(0.02, 0.03, 0.13) * ( glowFactor * x * cos(mod(time*5.0, 5.0)-5.0));
	
	gl_FragColor = vec4( c, 1.00 );

}