/* A correction to "World's Simplest 1D Raymarch'

at      https://www.shadertoy.com/view/XlBSDz

( I'm unable to post this to shadertoy, as it consistently fails to load
both shaders and code due to an as-yet-unresolved JSON error in my Firefox setup. ) 

See the original for the author's comments, not copied here.
------------------------------------------------------------

There were three errors in the original code:

float distanceFromTarget( float p )
{
        // original
	// return 0.0 - p;

	// Distances must be positive to work with the code in trace().
	return abs( 0.0 - p );
}

    
In main()

	// 'middle' was declared as a non-normalized value, then used as a comparison to
	// a normalized x-coordinate.
	//float middle = scrnRes.x / 2.0;
	
	float middle = 0.0;	

	-------------------

	// Comparing uv.x < middle was always true in the original code. 
        // x-values < 0 need to move in the positive x-direction to reach 0.0; 
        // x-values > 0 need to move in the negative x-direction.
	
        //float direction = uv.x < middle ? -1.0 : 1.0;

	float direction = uv.x < middle ? 1.0 : -1.0;


The value of 'amount' returned from trace() is the total distance required to move from
the 'target' x-coord to the 'middle', 0.0; so the graphical result is a gradient from
black at the center to white at both outer edges of the screen, rather than the original
divided black and white screen.

----------------------------------------------------------------------------------------
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFromTarget( float p )
{
    return abs( 0.0 - p );
}

float trace( float target, float direction )
{
    float amount = 0.0;
    
    for ( int i = 0; i < 64; i++ )
    {
        float p = target + direction * amount;
        float distance = distanceFromTarget( p );
        amount = amount + distance / 2.0;
    }
    return amount;
}

void main( void ) 
{
    float middle = 0.0;//scrnRes.x / 2.0;
	
    vec2 uv = gl_FragCoord.xy / resolution.xy;	
    uv = uv * 2.0 - 1.0;						
    uv.x *= resolution.x / resolution.y;		
    
    float direction = uv.x < middle ? 1.0 : -1.0;
    float t = trace( uv.x, direction );			
    
    gl_FragColor = vec4( t, t, t, 1 );
}