// Graphic Primitives
// By: Brandon Fogerty
// bfogerty at gmail dot com

// Here are some graphical building block functions that you can use
// to build more complex scenes.
// The functions will check to see if a given point is on the outline of a shape.
// If it is, it returns 1.0, if not it returns 0.0.
// If 1 is returned, you can multiply that by a color to draw the shape.
// Epsilon controls the thickness of the line.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define Time			time
#define Resolution		resolution


float drawLine( vec2 p, vec2 a, vec2 b, float epsilon )
{
	vec2 aToB = b - a;
	vec2 aToP = p - a;
	
	float t = length( aToP ) / length( aToB );
	if( t < 0.00 || t > 1.0 )
	{
		return 0.00;
	}
	
	vec2 p1 = mix( a, b, t );
	if( length( p1 - p ) <= epsilon )
	{
		return 1.0;
	}
	
	return 0.00;
}

float drawTriangle( vec2 p, vec2 a, vec2 b, vec2 c, float epsilon )
{
	float t = drawLine( p, a, b, epsilon );
	t += drawLine( p, a, c, epsilon );
	t += drawLine( p, b, c, epsilon );
	
	
	return step( 1.0, t );
}

float drawRectangle( vec2 p, vec2 a, vec2 b, vec2 c, vec2 d, float epsilon )
{
	float t = drawLine( p, a, b, epsilon );
	t += drawLine( p, c, d, epsilon );
	t += drawLine( p, a, c, epsilon );
	t += drawLine( p, b, d, epsilon );
	
	return step( 1.0, t );
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / Resolution.xy ) * 2.0 - 1.0;
	uv.x *= Resolution.x / Resolution.y;
	
	vec2 a = vec2( -0.5, 0.5 );
	vec2 b = vec2( 0.5, 0.5 );
	vec3 finalColor = drawLine( uv, a, b, 0.01 ) * vec3( 0.0, 0.0, 1.0 );
	
	a += vec2( 0.0, -0.10 );
	b += vec2( 0.0, -0.10 );
	vec2 c = vec2( 0.0, 0.0 );
	finalColor += drawTriangle( uv, a, b, c, 0.01 ) * vec3( 1.0, 0.0, 0.0 );

	a += vec2( 0.0, -0.45 );
	b += vec2( 0.0, -0.45 );
	c = a + vec2( 0.0, -0.50 );
	vec2 d = b + vec2( 0.0, -0.50 );
	finalColor += drawRectangle( uv, a, b, c, d, 0.01 ) * vec3( 0.0, 1.0, 0.0 );
	
	gl_FragColor = vec4( finalColor, 1.0 );

}