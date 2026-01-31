// LOL 
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592

void main( void )
{
	vec3 color = vec3( 1.0,0.9,0.6 );
	
	float dist = distance( gl_FragCoord.xy, vec2( resolution.x * 0.5, 1.0 ) );
	vec2 diff =  gl_FragCoord.xy - vec2( resolution.x * 0.5, 1.0 );
	float angle = atan( diff.y, diff.x );
	
	if( step( fract( ( angle / PI * 8. ) + ( time * 0.3 ) ), 0.5 ) > 0.0 )
	{
		color = vec3( 0.9, 0.5, 0.05 );
	}
	
	if( dist < resolution.x * 0.08 )
	{
		color = vec3( 1.0, 0.5, 0.05 );
	}

	gl_FragColor = vec4( color, 1.5 );

}