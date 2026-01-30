// used to draw these on graph paper instead of paying attention in high school math class...
// not much has changed :)
#ifdef GL_ES
precision highp float;
#endif

#define epsilon 0.003

uniform float time;
uniform vec2 resolution;

vec3 finalColor = vec3( 0.0, 0.0, 0.0 );

vec2 a = vec2( 0.0, 0.0 );
vec2 b = vec2( 0.0, 0.0 );
vec2 c = vec2( 0.0, 0.0 );
vec2 d = vec2( 0.0, 0.0 );
vec2 aToB = vec2( 0.0, 0.0 );
vec2 aToP = vec2( 0.0, 0.0 );
vec2 p1 = vec2( 0.0, 0.0 );
vec2 uv = vec2( 0.0, 0.0 );

float t = 0.0;
		
	
float drawLine( vec2 p, vec2 a, vec2 b )
{
	aToB = b - a;
	aToP = p - a;
	
	t = length( aToP ) / length( aToB );
	if( t < 0.00 || t > 1.0 )
	{
		return 0.00;
	}
	
	p1 = mix( a, b, t );
	if( length( p1 - p ) <= epsilon )
	{
		return 1.0;
	}
	
	return 0.0;
}

void main( void ) 
{

	uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	//upper right quadrant
	for (float i = 0.0; i < 1.05; i += 0.05 ) 
	{
		a = vec2( i , 0.0 );
		b = vec2( 0.0, 1.0 - i );
	
		finalColor += drawLine( uv, a, b ) * vec3( 0.0, 1.0, 0.0 );
	}
	
	//upper left quadrant
	for (float i = 0.0; i > -1.05; i -= 0.05 ) 
	{
		a = vec2( i , 0.0 );
		b = vec2( 0.0, 1.0 + i );
	
		finalColor += drawLine( uv, a, b ) * vec3( 0.0, 1.0, 0.0 );
	}
	
	//lower right quadrant
	for (float i = 0.0; i < 1.05; i += 0.05 ) 
	{
		a = vec2( i, 0.0 );
		b = vec2( 0.0, i - 1.0 );
	
		finalColor += drawLine( uv, a, b ) * vec3( 0.0, 1.0, 0.0 );
	}
	
	//lower left quadrant
	for (float i = 0.0; i < 1.05; i += 0.05 ) 
	{
		a = vec2( 0.0 - i, 0.0 );
		b = vec2( 0.0, i - 1.0 );
	
		finalColor += drawLine( uv, a, b ) * vec3( 0.0, 1.0, 0.0 );
	}
	
	gl_FragColor = vec4( finalColor, 1.0 );

}