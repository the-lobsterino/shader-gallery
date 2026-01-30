/*
 *  ändrom3d△ - a little bit of yin-yang
 */

//// options
#define glowColor1   vec3( 0.5, 0.2, 0.4 )
#define glowColor2   vec3( 0.0, 0.3, 0.6 )
#define speed        1.0
#define minRatio     ( 1./8. )*1.            // try out 0. or *0. for that matter

//// stuff
#extension GL_OES_standard_derivatives : enable
#define v3o vec3( 0. )
#define v31 vec3( 1. )
#define v2o vec2( 0. )
#define v21 vec2( 1. )
#define res resolution
#define sat( x ) clamp( x, 0., 1. )
#define flip( x ) ( 1. - (x) )
#define flipstep( x, y ) ( 1. - step( x, y ) )
#define rot( x ) mat2( cos( x ), -sin( x ) , sin( x ), cos( x ) )
#define nsin( x ) sin( x )*.5 + .5
precision highp float;
uniform float time;
#define time time*speed
uniform vec2 mouse;
uniform vec2 resolution;
vec3 o = v3o;
vec2 u = v2o;
vec2 m = mouse*res;


float circle( vec2 u, float r) { return step( length( u ), r ); }

float yinYang( vec2 u, float radius, float ratio )
{
    float o;
    float dotStrength = ( 1./8. );
    o += 2.*circle( u, 1.);  
    o -= 4.0*circle( u, 1.0 )*flipstep( u.x, .0 ); o = sat( o );
    o += 4.0*circle( u + vec2( 0., flip( ratio ) ), ( dotStrength )*ratio*2. );   
    o -= 4.0*circle( u + vec2( 0., -ratio ), ( dotStrength )*flip( ratio )*2. );
    o += 2.*circle( u - vec2( 0., ratio ), flip( ratio ) );
    o -= circle( u - vec2( 0., -flip( ratio ) ), ratio ); o = sat( o );
    return o;	
}

void main( void )
{
    /// coords and mouse...
    u = 2.*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );	 
    m = 2.*( m               - res/2. )/min( res.x, res.y );   
    
    /// center everything at mouse position
    //u -= m;	
	
    /// make everything a little bit smaller
    u /= ( 3./4. );    	
   
    /// calculating the change between black and white in the yin-yang
    float ratio;// = nsin( time/4. );
    //ratio = mix( ( minRatio ), flip( minRatio ), ratio );
    ratio = mouse.y;
	
    /// glow color changing
    o += mix( glowColor1, glowColor2, nsin( time ) );
    
    /// a little bit of rotation
    u *= rot( time );	
	
    /// adding glow, border, the yin-yang and so on...
    float border = 1./64.;
    o -= circle( u, 1. + border );
    o -= smoothstep( 1.0, 1.4, length( u - vec2( 0.00, -0.02 ) ) ); o = sat( o ); // smooth shadow
    o += circle( u, 1. );
    o -= yinYang( u, 1.0, ratio );   // sutracting the yin-yang-mask...

    /// final fragment
    gl_FragColor = vec4( o, 1. );
}