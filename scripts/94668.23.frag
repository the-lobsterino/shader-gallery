/*
 *  ändrom3dA△a
 *  just another thing 4 testing... 
 */

//// options																			OPTIONS BELOW
#define zoOM                     ( 1./16. ) 
#define coLOr                    vec3( 0.0, 0.0, 0.0 )
#define speed                    ( 1./1. )
#define timeOffset               0.0

/* ------------------------------------------------------------------- */

//// debug stuff
#define debugA_use               1
    //#define debugA_show            ( m1.y )

//// mouse options
#define mouse_Zoom               ( 24.0/1. )  	 
	 
//// grid options
#define grid_Resolution          1.0
#define grid_LineThickness       0.01
#define grid_Color               vec3( 0.0, 0.2, 0.03 )
#define grid_Differentiation     2

//// my favorite irrational numbers
#define tau                      6.283185307186       // acos( -1. )
#define phi                      1.618033988749895    // sqrt( 5. )*.5 + .5
#define inv_phi                  0.618033988749895    // phi - 1.

//// other green stuff
#define t                        ( time*speed + timeOffset )
#define v2o                      vec2( 0. )           // well it's v2o not v20...
#define v21                      vec2( 1. )
#define v3o                      vec3( 0. )
#define v31                      vec3( 1. )
#define pi                       3.141592653589793     // ( tau/2.)
#define nsin( x )                sin( x )*.5 + .5
#define ncos( x )                cos( x )*.5 + .5
#define nnsin( x )               sin( x*tau )*.5 + .5
#define nncos( x )               cos( x*tau )*.5 + .5
#define nnncos( x )              .5 - cos( x*tau )/2.  // just a normalized sinewave that starts at 0.0
#define tw                       nsin( time )
#define res                      resolution
#define rot( x )         	 mat2( cos( x ), -sin( x ), sin( x ), cos( x ) )
#define nrot( x )                mat2( cos( x*tau ), -sin( x*tau ), sin( x*tau ), cos( x*tau ) )
#define sat( x )                 clamp( x, 0., 1. )
#define flip( x )                ( 1. - (x) )
#define inv( x )                 ( 1./(x) )
#define lerp                     mix

//// some basic colors
#define black                    vec3( 0.0, 0.0, 0.0 )
#define white                    vec3( 1.0, 1.0, 1.0 )
#define red                      vec3( 1.0, 0.0, 0.0 )
#define green                    vec3( 0.0, 1.0, 0.0 )         
#define blue                     vec3( 0.0, 0.0, 1.0 )
#define violet                   vec3( 1.0, 0.0, 1.0 )
#define turquoise                vec3( 0.0, 1.0, 1.0 )
#define yellow                   vec3( 1.0, 1.0, 0.0 )
#define orange                   vec3( 1.0, 0.5, 0.0 )

//// more not so green stuff
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 res;
vec2 p, p0, p1,
     m  = mouse*res,             // this is later normalized to uv screen coordinates ("p")
     m0 = mouse,
     m1 = 2.*mouse - 1.,         // bottom -1.0, center 0.0, top +1.0
     m2 = mouse*.5 + .5,         // bottom 0.5, center, top +1.0
     m3 = mouse + .5;            // want it in the center 1. and bottom 0. and top 2.
vec3 o = v3o;

//// functions																			 FUNCTIONS BELOW 
float remapMouse( float y )      // when the mouse is in the middle 
{
    float minZoom = 0.0001;
    if ( y < 1. ) return m1.y + 1. + minZoom;
    else          return y;
}

float circle( vec2 p, float r )
{
    return length( p ) - r;
}

//// grid functions
#define glt  grid_LineThickness
#define gres grid_Resolution
#define gcol grid_Color
//#define glt inv(res.x)
float grid( vec2 p, float gridResolution, float lineThickness )
{
    
    return clamp(
	          step( cos( tau*( p.x/gres + .5 ) ), glt - 1. ) +
	          step( cos( tau*( p.y/gres + .5 ) ), glt - 1. ),          // could also be done with smoothstep
	   0.0, 1.0 );
}
vec3 gridSystem( vec2 p )
{ 
    vec3 o = v3o;
    float cnt = 1.;
    for ( int i = 0; i < grid_Differentiation; i++ )
    {
        o += grid( p, 1./cnt, glt/float( i + 1 ) );
        cnt *= 4.;
    }
    o = gcol*clamp( o, 0., 1. );
    float axisLineStrength = glt*3.;
    #define als axisLineStrength
    float axisStrength = 3.;
    o += gcol*axisStrength*(2. - ( step( p.y, -als ) + step( als, p.y ) ) -
                                 ( step( p.x, -als ) + step( als, p.x ) ) );
    return o;
}

void debugA() // this will be executed at the end of this shader											        DEBUG A BELOW
{
    #ifdef debugA_show
        o += debugA_show;
    #endif
}

float sineN( float x, int N )   // sinewave that only "waves" only every "Nth" period starting at 0. well this could also be done easier see line 161 (without mod, overlaying and cutting)... 
{
    float o = ( sin( x - pi/2. ) + 1. )/2.;
    o *= step( mod( x, float( N )*tau ), tau );
    return o;
}

void main( void ) //																		MAIN THREAD BELOW
{
    /// normalize screen coord & mouse
    p = p1 = ( gl_FragCoord.xy - res/2. )/min( res.x, res.y );   // coord 0.0 as center of screen
    m =      ( m               - res/2. )/min( res.x, res.y );   // normalize mouse to screen coords

    
	
    /// apply zoom and mouse zoom
    p *= inv( zoOM ); p1 *= inv( zoOM );
    p *= inv( remapMouse( mouse_Zoom*m1.y + 1. ) ); p1 *= inv( remapMouse( mouse_Zoom*m1.y + 1. ) );  // p1 is for the grid see line before as well (& this one is only for y)
    p.x += 1600.*zoOM*m.x; p1.x += 1600.*zoOM*m.x;
	

    /// a simple graph...
    float x = p.x;     
    float y, z, w;
	
	/*================================*/
        
	y = sin(x);
	
	
	/*=================================*/
	
	y = -y; z = -z; w = -w;
	
	y = ( 1.0 + 8.0*inv( 2.*mouse.y ) ) - 128.*length( y + p.y );  // for drawing  // keeps it roughly the same size the line 
        z = ( 1.0 + 8.0*inv( 2.*mouse.y ) ) - 128.*length( z + p.y );  // for drawing  // keeps it roughly the same size the line 
        w = ( 1.0 + 8.0*inv( 2.*mouse.y ) ) - 128.*length( w + p.y );  // for drawing  // keeps it roughly the same size the line 	
	
	
	
    o = orange*1.0*( sat( y ) ) + 
	red*1.0*( sat( z ) ) +
	violet*1.0*( sat( w ) );
 
    /// adding grid in the end	
    o += gridSystem( p1 );
	
    #if ( debugA_use == 1 )
      debugA();	
    #endif
	
    /// final fragment	
        //o = sqrt(o);
    gl_FragColor = vec4( o, 1. );
}