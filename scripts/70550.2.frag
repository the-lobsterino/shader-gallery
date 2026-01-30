

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
	
	float amplitude = 0.0; 
	float glowT = sin(time) * 0.2 + 0.2;
	float glowFactor = mix( 0.1, 0.10, glowT );
	c += vec3(0.05, 0.02, 0.01) * ( glowFactor * abs( 1.0 / (p.x + ( p.y + time ) * amplitude ) ));
	
	gl_FragColor = vec4( c, 0.2 );

}