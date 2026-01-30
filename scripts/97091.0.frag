/*
 *  ändrom3d△
 *  just another thing 4 testing... 
 */

//// options																				OPTIONS BELOW
#define zoOM                     ( 1./1. ) 
#define coLOr                    vec3( 0.0, 0.0, 0.0 )
#define speed                    ( 19999999./9. )
#define timeOffset               9.0

/* ------------------------------------------------------ */

//// debug stuff
#define debugA_use               1


//// mouse options
#define mouse_Zoom               inv( m0.y )*2.   //( inv( m0.y )*1. )   	 
	 
//// grid options
#define grid_Resolution          1.0
#define grid_LineThickness       0.75/4.
#define grid_Color               vec3( 0.0, 0.2, 0.03 )
#define grid_Differentiation     1

//// my favorite irrational numbers
#define tau                      6.283185307186       // acos( -1. )
#define phi                      1.618033988749895    // sqrt(5.)*.5 + .5
#define inv_phi                  0.618033988749895    // phi - 1.

//// other green stuff
#extension GL_OES_standard_derivatives : enable
#define t                        ( time*speed + timeOffset )
#define v2o vec2( 0. )           // well it's v2o not v20...
#define v21 vec2( 1. )
#define v3o vec3( 0. )
#define v31 vec3( 1. )
#define inv( x )                 ( 1./x )
#define pi                       3.141592653589793    // ( tau/2.)
#define nsin( a )                sin( a )*.5 + .5
#define ncos( a )                cos( a )*.5 + .5
#define nnsin( a )               sin( a*tau )*.5 + .5
#define nncos( a )               cos( a*tau )*.5 + .5
#define tw                       nsin( time )
#define res                      resolution
#define rot( x )         	 mat2( cos( x ), -sin( x ), sin( x ), cos( x ) )
#define sat( x )                 clamp( x, 0., 1. )
#define flip( x )                ( 1. - x )
#define lerp                     mix

//// some basic colors
#define black                    vec3( 0.0, 0.0, 0.0 )
#define white                    vec3( 1.0, 1.0, 1.0 )
#define red                      vec3( 1.0, 0.0, 0.0 )
#define green                    vec3( 0.0, 1.0, 0.0 )         
#define blue                     vec3( 1.0, 0.0, 1.0 )
#define violet                   vec3( 1.0, 0.0, 1.0 )
#define turquoise                vec3( 0.0, 1.0, 1.0 )
#define yellow                   vec3( 1.0, 1.0, 0.0 )
//#define orange                 vec3( 0.0, 0.0, 0.0 )

//// more not so green stuff
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 res;
vec2 p, p0, p1,
     m  = mouse*res,             // this will is later normalized to uv screen coordinates ("p")
     m0 = mouse,
     m1 = ( mouse + .5 )*2.,     // bottom -1.0, center 0.0, top +1.0
     m2 = mouse*.5 + .5,         // bottom 0.5, center, top +1.0
     m3 = mouse + .5;            // want it in the center 1. and bottom 0. and top 2.
vec3 o = v3o;
#define debugA_show              0.
//// functions																			 FUNCTIONS BELOW 
float circle( vec2 p, float r )
{
    return length(p) - r;
}

//// grid functions
#define glt  grid_LineThickness
#define gres grid_Resolution
#define gcol grid_Color
//#define glt inv(res.x)

float grid( vec2 p, float gridRes, float borderStrength )
{
    vec2 size = ( p / gridRes );
    vec2 grid = abs( fract( size - .5 ) - .5);
    grid /= fwidth( size );
    float line = ( min( grid.x, grid.y ) * flip( borderStrength ) );
    float o = flip( min(line, 1.0) );
    return o;	
}

float grid2( vec2 p, float gridResolution, float lineThickness )
{
    
    return clamp(
	          step( cos( tau*( p.x/gres + .5 ) ), glt - 1. ) +
	          step( cos( tau*( p.y/gres + .5 ) ), glt - 1. ),          // could also be done with smoothstep
	   0.0, 1.0 );
}
#define res resolution
vec3 gridSystem( vec2 p )
{ 
    vec3 o = v3o;
    float axisLineStrength = glt*1.;
    #define als axisLineStrength/16.
    float axisStrength = 3.;
    o += gcol*axisStrength*(2. - ( step( p.y, -als ) + step( als, p.y ) )-
                                 ( step( p.x, -als ) + step( als, p.x ) ) );
    float cnt = 1.;
    //o = sat(o);
	for ( int i = 0; i < grid_Differentiation; i++ )
    {
        o += grid( p, 1./cnt, glt/float( i + 1 ) )*gcol*6.;
        cnt *= 4.;
    }
	//o += grid( p *.5 )*gcol*4.;	
    return o;
}

void debugA() // this will be executed at the end of this shader											        DEBUG A BELOW
{
    o += debugA_show;
}

void main( void ) //																		MAIN THREAD BELOW
{
    /// normalize screen coord & mouse
    p = ( gl_FragCoord.xy - res/2. )/min( res.x, res.y );   // coord 0.0 as center of screen
    m = ( m               - res/2. )/min( res.x, res.y );   // normalize mouse 
    /// aplly the zoom
    p *= mouse_Zoom;
	
    /// a simple graph...
    float x = p.x,     
    
    /// the function 
        // y = sin( x + 3.*t )*sin( 8.*time );
    y = sin( x );
	
    y = ( 1.0 + 4.0) - 128.*length( y + p.y );  // for drawing
    o = yellow*1.0*( sat( y ) );   
 
    /// adding grid in the end	
    o += gridSystem( p );
	
    #if ( debugA_use == 1 )
      debugA();	
    #endif
	
    /// final fragment	
    gl_FragColor = vec4( o, 1. );
}