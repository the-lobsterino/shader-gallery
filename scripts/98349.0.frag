/* 
 ändrom3da -
 antialiased sierpinski fake 3d
 with a few options (see below)
*/

/// options
#define zoOm            ( 1./1. )
#define antiAliasing      3.
#define atMousePosition   1          // makes everything centered at the mouse position
#define speed           ( 3./2. )

// sierpinsky options
#define iTer              5
#define fillHoles         0          // fills the black squares with "sierpinskys" too
#define areA              1          // make an infinite area instead of a square
#define iNvert            1

/// stuff
#define tau 6.28318530718
#define aA antiAliasing
#define res resolution
#define flip( x ) ( 1. - ( x ) )
#define inv( x ) ( 1. /( x ) )
#define sat( c ) clamp( c, 0., 1. )
precision highp float;
const float aAA = aA*aA;
uniform float time;
#define time ( time*speed )
uniform vec2 mouse;
uniform vec2 resolution;
float z = inv( zoOm );
vec2 p, p0, m = mouse*res;
vec3 c0 = vec3( 0. );

/// standard functions
void xor( inout float x ) { x = mod( x, 2. ); }
void xor( inout vec3 x ) { x = mod( x, vec3( 2. ) ); }
void saturate( inout float c ) { c = clamp( c, 0., 1. ); }
void saturate( inout vec3 c ) { c = clamp( c, 0., 1. ); }
float circle( vec2 p, float r ) { return step( length( p ), r ); }
float square( vec2 p, float size ) { return step( abs( p.x ), size )*step( abs( p.y ), size ); }
float rectangle( vec2 p, vec4 rect ) { vec2 hv = step( rect.xy, p )*step( p, rect.zw ); return hv.x*hv.y; }

vec3 hsv2rgb( float h, float s, float v )   // iq's version
{
    vec3 rgb = clamp( abs( mod( h*6. + vec3( 0., 4., 2. ), 6. ) - 3.0 )- 1., 0., 1. );
    return v*mix( vec3( 1. ), rgb, s );   
}

float sierpinski( vec2 p, float size, float zoom )
{ 
        p *= 1.5/size/zoom;
	float o = 1., z = 1.;

	vec2 p0 = p;
	
	p -= 1.;
	 
	for ( int i = 0; i < iTer; i++ )
	{
	    p -= z + .5;
	    p = mod( p/z, 3. );
	    o -= square( p, 1. );
    	    z /= 3.;
	    p = p0;
	}
	#if ( iNvert == 1 )
	  o = flip( o );
	#endif
        #if ( fillHoles == 1 )
	  xor( o );
	#endif
	#if ( areA == 0 )
	  o *= square( p, 1.5 ); // cut out the final piece
        #endif
	saturate( o );
	return o;
}

void main( void )
{
    // aA: nested loop for supersampled antialiasing
    for ( float kk = 0.; kk < aA; kk++ ) for ( float ll = 0.; ll < aA; ll++ )
    {
        // aA: definition of variables for color c, position p and mouse m
	vec3 c = vec3( 0. );
	p =                      z*( gl_FragCoord.xy - ( vec2( kk, ll ) - .5)/vec2( aA ) - res/2. )/min( res.x, res.y ); p0 = p;
	if ( kk + ll == 0. ) m = z*(               m - ( vec2( kk, ll ) - .5)/vec2( aA ) - res/2. )/min( res.x, res.y );    

	// fake  magic!
	p.y = 1./abs( p.y ); p.x *= p.y; p.y += time;
   
        // makes everything centered at mouse position
	#if ( atMousePosition == 1 )
	  p.x -= 2.*m.x;
        #endif
	
	    
        // here comes your code
	float vig = length( p0*5. );
	p.y /= 2.;
	c += sierpinski( p, 1., 1. )*hsv2rgb( p.y/64., 1., clamp( length( p0.y*8. ), 0., 4. ) );
	    
	//c += xorPattern( p, 1. );    
	
	//c += circle( p, 1. );
	    
	// aA: accumuluting color at the end of inside the nested loop
        c0 += c;   
    }    
	
    // aA: "saturating" the accumulated color back to be between 0 to 1.
    c0 /= aAA;    c0 /= 4.;
    gl_FragColor = vec4( c0, 1. );
}