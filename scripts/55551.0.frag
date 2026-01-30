#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction( vec3 p )
{
	return length( p ) - 0.5;
}

void main( void ) {

	//vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / min( resolution.x, resolution.y );
	
	vec3 cameraPos = vec3( 0.0, 0.0, -5.0 );
	float screenZ = 2.5;
	vec3 rayDirection = normalize( vec3( p, screenZ ) );
	
	
	float depth = 0.0;
	vec3 color = vec3(0.0);
	for( int i = 0; i < 64; i++ )
	{
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction( rayPos );
		
		if( dist < 0.0001 )
		{
			color = vec3(1.0);
			break;
		}
		
		depth += dist;
	}
	
	
	
	gl_FragColor = vec4(  color, 1.0 );

}