/*
 *  ändrom3da - justbspiral
 *
 *  change horizontal mouse position for number of spiral Arms,
 *  change   vertical mouse position for color/palette/hue-shift.
 *
 */

/// options
#define zoOM         2./4.
#define spEED        1./1.
#define colorOffset  tau/2.
#define rotation     -.13+2.*time     // change this from -.13 to +.13

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
precision highp float;
uniform float time;
#define time time*spEED
uniform vec2 mouse;
uniform vec2 res;
float z = inv( zoOM );
vec2 p = vec2( 0. ), m0 = mouse, m1 = mouse*res;
vec3 c = vec3( 0. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
//vec3 hsv2rgb( float h, float s, float v ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return v*mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), s ); }
vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void main( void ) {
	p =  z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
	m1 = z*(           m1.xy - res/2. )/min( res.x, res.y );
	float lp = length( p*48. )*cos( time)*.13;
	p *= rot( lp );
	p *= rot( 16.*cos( time)*rotation );
	float theta = atan( p.y, p.x );
        float Arms = floor( m1.x * 2.67 + .5 );
	c += step( sin( theta*float( Arms ) + ( colorOffset ) ), 0. );
	c *= circle( p, 1. );
        c *= hueShift( m0.y )*vec3( 1. );
	gl_FragColor = vec4( c, 1. ); } //>

