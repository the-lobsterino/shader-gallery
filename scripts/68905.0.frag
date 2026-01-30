

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	vec3 c = vec3( 0.0 );
	
	float amplitude = 0.30; 
	float glowT = sin(time) * 0.5 + 0.2;
	float glowFactor = mix( 0.15, 0.55, glowT );
	c += vec3(0.02, 0.03, 0.13) * ( glowFactor * abs( 1.0 / sin(p.x + sin( p.y + time ) * amplitude ) ));

	gl_FragColor = vec4( c, 1.0 );

}