/// ä

/// options
#define pointerSize 0.7

/// stuff
#extension GL_OES_standard_derivatives : enable
#define res resolution
#define flip( x ) ( 1. - ( x ) )
#define rootof2minus1 .41421356237
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float z = 1.;                         //
vec2 p, m = mouse;
vec3 c = vec3( 0. );

float tria( vec2 p, float size )
{
    float o, t1 = 0., t2 = 0.;
    t1 = flip( step( -p.x, p.y ) )*step( 0., p.x )*step( -size, p.y );
    t2 += ( step( p.x - rootof2minus1*size, p.y + size ) );
    t2 *= step( p.y, -size )*step( 0., p.x  );   
    o = t1 + t2;
    return o;	
}

float pointer( float size )
{
    float o = 0.;
    o += .13*tria( p + vec2( -.08*size, .10*size ), size );  // shadow
    o += tria( p, size );
    o -= 3.*tria( p + vec2( -.065*size, .16*size ), .77*size );
    return o;
}

void main( void )
{
    // normalize fragment position
    p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );    
    
    // normalize mouse position	
    m *= res.xy + 1.0;
    m = z*(               m - res/2. )/min( res.x, res.y ) ;
    m.y += 0.45;
    m.x-=0.19;
    
    // shaded color background
    c += .5*vec3( mix( 1. , 1.25, p.x + sin( time) ), 0., 1. );
    
    // position the mouse	
    p -= m;
	
    // draw the pointer
    c -= pointer ( pointerSize );
    
    // final color
    gl_FragColor = vec4( c, 1. );
}