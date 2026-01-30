/*
 *  ändrom3da - color pickER c
 *  inspired by: https://glslsandbox.com/e#99218.0
 *
 */

/// options
#define zoOM         ( 1./2. )
#define saturatiON   ( 4./5. )
#define circleSize   ( 1./3.25 )
#define ringSize     ( 1./3.25 )
#define pickerSize   ( 1./15. )

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define flip( x ) ( 1. - ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a ), cos( a ) )
precision highp float;
uniform vec2 mouse, res; 
float z = inv( zoOM ), minRes = min( res.x, res.y);
vec2 p = vec2( 0. ), m0 = mouse, m1 = mouse*res;
vec3 c = vec3( 0. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3 hsv2rgb( float h, float s, float v ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www );return v*mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), s ); }

void main( void ) {
    // screen, zoom and mouse
    p  = z*( gl_FragCoord.xy - res/2. )/minRes;
    m1 = z*(           m1.xy - res/2. )/minRes;

    // angle
    float theta = atan( p.x, p.y ),
    angle = atan( m1.x, m1.y ); // angle = 3.67*m1.x;
	
    // outer ring
    c += circle( p, 1. ) - circle( p, flip( ringSize ) );
    c *= hsv2rgb( theta/tau, saturatiON, 1. );
    
    // color picked
    vec3 hue = hsv2rgb( angle/tau, saturatiON, 1. );
	
    // middle circle
    c += circle( p, circleSize )*hue;
    
    // picker destination
    p *= rot( angle );
	
    // picker
    c += step( c, vec3( 0. ) )*( step( p.x, pickerSize/2. )*step( -pickerSize/2., p.x )*
    step( 0., p.y )*step( length( p ), 1. ) )*hue; 
   
    // final color
    gl_FragColor = vec4( c, 1. ); }