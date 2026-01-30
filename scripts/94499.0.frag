// ändrom3da - seed of life
// --> place the mouse in the middle of the screen & you should get the so called "seed of life"

// options
#define rotation 1

precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D bb;

// stuff
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )
#define res resolution
#define nsin( a )       sin( a )*.5+.5

float c = 0.0;

float circle(vec2 p, float r)
{
    vec2 d = p - vec2(0.0);
    return 1.0 - smoothstep( r - 0.015, r, length(d));
}

float bcircle( vec2 p, float r )
{
	return step( length( p ), r);
}

#define time time*4.
void main( void )
{
    vec2 p;
    vec2 p0 = gl_FragCoord.xy/resolution.xy;
    float zoom = mouse.y*4.;
    p = zoom*( 2.*gl_FragCoord.xy - res )/min( res.x, res.y );

    #if ( rotation == 1 )	
    p *= rot( time*1. );
    #endif

    float dist = clamp(mod(sqrt( floor( time*200. )/80. ),5.0),0.0,2.);	
    
    float l = sqrt( 3. )/dist;
    float s =     ( 1. )/dist;
    float n =     ( 2. )/dist;

    // well i guess here comes the hardcoded stuff
    c = circle( p, 1.0 );
    p.x -= l;
    p.y -= s;
    c += circle( p, 1.0 );
    p.x += l;
    p.y -= s;
    c += circle( p, 1.0 );
    p.x += l;
    p.y += s;
    c += circle( p, 1.0 );
    p.x -= 0.;
    p.y += n;
    c += circle( p, 1.0 );
    p.x -= l;
    p.y += s;
    c += circle( p, 1.0 );
    p.x -= l;
    p.y -= s;
    c += circle( p, 1.0 );
	
    // white + white = black
    c = mod( c, 2.0 );
    c = ( 7./8. )*texture2D( bb, p0 ).x + ( 1.5/16. )*c;   // backbuffer smoothness whateva... 
    gl_FragColor = vec4(c, c, c, 1.0);
}